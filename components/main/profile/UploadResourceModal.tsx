"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    X,
    Upload,
    FileText,
    BookOpen,
    GraduationCap,
    Loader2,
    CheckCircle,
    AlertCircle,
    DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "motion/react";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import { getSemestersByCourseId } from "@/features/semester/semesterThunk";
import { createResource, updateResource } from "@/features/teacher/resources/resourceThunk";
import { IResource } from "@/features/teacher/resources/resourceModel";
import apiClient from "@/services/apiClient";

const schema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    courseId: z.string().min(1, "Please select a course"),
    semesterId: z.string().min(1, "Please select a semester"),
    isPaid: z.boolean().optional(),
    price: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    editResource?: IResource | null;
}

export default function UploadResourceModal({ isOpen, onClose, editResource }: Props) {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { semestersByCourseId } = useAppSelector((state) => state.semester);
    const { loading } = useAppSelector((state) => state.resource);

    const [file, setFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState("");
    const [dragOver, setDragOver] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploading, setUploading] = useState(false);

    const courses = user?.courseIds || [];



    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            isPaid: false,
            price: 0,
        },
    });

    const selectedCourseId = watch("courseId");

    // Load semesters when course changes
    useEffect(() => {
        if (selectedCourseId) {
            dispatch(getSemestersByCourseId(selectedCourseId));
            console.log(selectedCourseId)
            setValue("semesterId", "");
        }
    }, [selectedCourseId, dispatch, setValue]);

    // Pre-fill form in edit mode
    useEffect(() => {
        if (editResource) {
            reset({
                title: editResource.title,
                description: editResource.description,
                courseId: (editResource.course as any)?._id || "",
                semesterId: "",
                isPaid: editResource.isPaid,
                price: editResource.price,
            });
            setIsPaid(editResource.isPaid);
        } else {
            reset({ title: "", description: "", courseId: "", semesterId: "", isPaid: false, price: 0 });
            setFile(null);
            setIsPaid(false);
        }
    }, [editResource, reset]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) validateAndSetFile(dropped);
    };

    const validateAndSetFile = (f: File) => {
        const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "video/mp4", "image/jpeg", "image/png"];
        if (!allowed.includes(f.type)) {
            setFileError("Only PDF, DOC, DOCX, MP4, JPG, PNG files are allowed.");
            return;
        }
        if (f.size > 50 * 1024 * 1024) {
            setFileError("File must be under 50MB.");
            return;
        }
        setFileError("");
        setFile(f);
    };

    const onSubmit = async (data: FormValues) => {
        if (!file && !editResource) {
            setFileError("Please upload a file.");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("courseId", data.courseId);
            formData.append("semesterId", data.semesterId);
            formData.append("isPaid", String(isPaid));
            formData.append("price", String(isPaid ? (data.price || 0) : 0));

            // Append the file if present
            if (file) {
                formData.append("fileUrl", file);
            } else if (editResource) {
                // If editing and no new file, we can optionally send the existing URL 
                // but the backend won't overwrite if file is missing in multipart.
                // However, the validation requires fileUrl if it's a create. 
                // For update, it's optional in the schema but let's see.
            }

            if (editResource) {
                await dispatch(updateResource({ id: editResource._id, resource: formData as any })).unwrap();
            } else {
                await dispatch(createResource(formData as any)).unwrap();
            }

            setUploadSuccess(true);
            setTimeout(() => {
                setUploadSuccess(false);
                onClose();
                reset();
                setFile(null);
            }, 1500);
        } catch (err: any) {
            console.error(err);
            toast.error(err || "Failed to save resource");
        } finally {
            setUploading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative bg-white rounded-3xl shadow-2xl shadow-indigo-100/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white z-10 px-8 pt-8 pb-6 border-b border-gray-100 flex items-center justify-between rounded-t-3xl">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <Upload size={22} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-[#1a1a3b]">
                                        {editResource ? "Edit Resource" : "Upload Resource"}
                                    </h2>
                                    <p className="text-xs font-bold text-gray-400 mt-0.5">
                                        Share study material with your students
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="h-10 w-10 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            >
                                <X size={18} className="text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-6">

                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">
                                    Resource Title <span className="text-rose-500">*</span>
                                </label>
                                <Input
                                    {...register("title")}
                                    placeholder="e.g., Data Structures - Lecture Notes Week 5"
                                    className="h-12 rounded-2xl border-gray-200 bg-gray-50 focus:bg-white font-medium text-[#1a1a3b] focus-visible:ring-indigo-500/30 focus-visible:border-indigo-400"
                                />
                                {errors.title && (
                                    <p className="text-xs text-rose-500 font-bold flex items-center gap-1">
                                        <AlertCircle size={12} /> {errors.title.message}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">
                                    Description <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    {...register("description")}
                                    rows={3}
                                    placeholder="Briefly describe what this resource covers..."
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white outline-none font-medium text-[#1a1a3b] text-sm resize-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                                {errors.description && (
                                    <p className="text-xs text-rose-500 font-bold flex items-center gap-1">
                                        <AlertCircle size={12} /> {errors.description.message}
                                    </p>
                                )}
                            </div>

                            {/* Course & Semester */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <BookOpen size={12} /> Course <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        {...register("courseId")}
                                        className="w-full h-12 px-4 rounded-2xl border border-gray-200 bg-gray-50 font-medium text-[#1a1a3b] text-sm focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all appearance-none"
                                    >
                                        <option value="">Select course</option>
                                        {courses.map((c: any) => (
                                            <option key={c._id} value={c._id}>{c.courseName}</option>
                                        ))}
                                    </select>
                                    {errors.courseId && (
                                        <p className="text-xs text-rose-500 font-bold flex items-center gap-1">
                                            <AlertCircle size={12} /> {errors.courseId.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <GraduationCap size={12} /> Semester <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        {...register("semesterId")}
                                        disabled={!selectedCourseId}
                                        className="w-full h-12 px-4 rounded-2xl border border-gray-200 bg-gray-50 font-medium text-[#1a1a3b] text-sm focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Select semester</option>
                                        {semestersByCourseId?.map((s: any) => (
                                            <option key={s._id} value={s._id}>{s.name}</option>
                                        ))}
                                    </select>
                                    {errors.semesterId && (
                                        <p className="text-xs text-rose-500 font-bold flex items-center gap-1">
                                            <AlertCircle size={12} /> {errors.semesterId.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Paid Toggle */}
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                        <DollarSign size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-[#1a1a3b]">Paid Resource</p>
                                        <p className="text-xs font-bold text-gray-400">Charge students for access</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsPaid(!isPaid)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${isPaid ? "bg-indigo-600" : "bg-gray-200"}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${isPaid ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                            </div>

                            {isPaid && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2"
                                >
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Price (₹)</label>
                                    <Input
                                        {...register("price")}
                                        type="number"
                                        min={1}
                                        placeholder="e.g., 99"
                                        className="h-12 rounded-2xl border-gray-200 bg-gray-50 focus:bg-white font-medium text-[#1a1a3b] focus-visible:ring-indigo-500/30"
                                    />
                                </motion.div>
                            )}

                            {/* File Upload */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">
                                    {editResource ? "Replace File (Optional)" : "Upload File"} <span className="text-rose-500">{!editResource && "*"}</span>
                                </label>
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={handleDrop}
                                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${dragOver ? "border-indigo-400 bg-indigo-50" : file ? "border-emerald-400 bg-emerald-50" : "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/40"}`}
                                >
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.mp4,.jpg,.jpeg,.png"
                                        onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    {file ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                <CheckCircle size={24} />
                                            </div>
                                            <p className="font-black text-emerald-700 text-sm">{file.name}</p>
                                            <p className="text-xs text-emerald-500 font-bold">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                                                <FileText size={24} />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-600 text-sm">Drop your file here or <span className="text-indigo-600">browse</span></p>
                                                <p className="text-xs text-gray-400 font-bold mt-1">PDF, DOC, DOCX, MP4, JPG, PNG — Max 50MB</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {fileError && (
                                    <p className="text-xs text-rose-500 font-bold flex items-center gap-1">
                                        <AlertCircle size={12} /> {fileError}
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="flex-1 h-12 rounded-2xl border-2 border-gray-100 font-black text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={uploading || loading}
                                    className="flex-1 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                                >
                                    {(uploading || loading) ? (
                                        <><Loader2 size={16} className="animate-spin" /> {editResource ? "Saving..." : "Uploading..."}</>
                                    ) : uploadSuccess ? (
                                        <><CheckCircle size={16} /> {editResource ? "Saved!" : "Uploaded!"}</>
                                    ) : (
                                        <><Upload size={16} /> {editResource ? "Save Changes" : "Upload Resource"}</>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
