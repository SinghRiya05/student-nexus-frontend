"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Plus,
  Users,
  Mail,
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  UserCog,
  Edit2,
  Trash2
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import AssignRoleDialog from "./AssignRoleDialog";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import { getAllUsers, deleteUser } from "@/features/users/userThunk";
import { logoutUser } from "@/features/auth/authThunk";
import { IUser } from "@/features/users/userModel";
import { toast } from "react-hot-toast";
import { Loader2, ChevronDown, ChevronUp, Globe, Calendar, BadgeCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";



export default function UserList() {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.user);
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isRoleDialogOpen, setIsRoleDialogOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<IUser | null>(null);
  const [expandedRowId, setExpandedRowId] = React.useState<string | null>(null);

  React.useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const toggleRow = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const handleManageRole = (user: IUser) => {
    setSelectedUser(user);
    setIsRoleDialogOpen(true);
  };

  const handleDeleteUser = async (id: string) => {
    const isSelf = id === currentUser?._id;
    const confirmMessage = isSelf 
      ? "Warning: You are about to delete your own account. You will be logged out immediately. Proceed?" 
      : "Are you sure you want to delete this user?";

    if (window.confirm(confirmMessage)) {
      const result = await dispatch(deleteUser(id));
      if (deleteUser.fulfilled.match(result)) {
        toast.success(isSelf ? "Your account has been deleted" : "User deleted successfully");
        if (isSelf) {
          dispatch(logoutUser());
        }
      } else {
        toast.error("Failed to delete user");
      }
    }
  };

  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const university = user.universityId?.name?.toLowerCase() || "";
      const role = user.roleId?.name?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";
      const searchTermLower = searchTerm.toLowerCase();

      return (
        fullName.includes(searchTermLower) ||
        university.includes(searchTermLower) ||
        role.includes(searchTermLower) ||
        email.includes(searchTermLower)
      );
    });
  }, [users, searchTerm]);

  if (loading && users.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500 font-medium">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Section */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600">
            <Users size={18} />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Access Control
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900">User Directory</h2>

          <p className="text-sm text-slate-500">
            Manage system users, assigned roles and account permissions.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex w-full md:w-auto items-center gap-3 justify-between md:justify-end">
          {/* Search Bar */}
          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 w-full sm:w-72">
            <Search size={16} className="ml-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="flex-1 px-2 py-2 outline-none text-sm bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm">
              Search
            </button>
          </div>

          {/* Create Button */}
          {/* API CALL PLACE: Handle user invitation / creation */}
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 h-10 rounded-lg whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" />
            Invite
          </Button>
        </div>
      </div>

      {/* Users Table Section */}
      <Card className="border-none shadow-sm bg-white overflow-hidden py-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-primary ">
                <TableRow className="hover:bg-transparent border-slate-100 ">
                  <TableHead className="font-bold text-white py-4 min-w-[200px]">Name</TableHead>
                  <TableHead className="font-bold text-white">Email</TableHead>
                  <TableHead className="font-bold text-white">Phone</TableHead>
                  <TableHead className="font-bold text-white">Role</TableHead>
                  <TableHead className="font-bold text-white">Status</TableHead>
                  <TableHead className="text-right font-bold text-white pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {filteredUsers.map((user) => (
                  <React.Fragment key={user._id}>
                    <TableRow
                      onClick={() => toggleRow(user._id)}
                      className={`group hover:bg-slate-50/50 transition-colors border-slate-100 cursor-pointer ${
                        expandedRowId === user._id ? "bg-indigo-50/30" : ""
                      }`}
                    >
                      <TableCell className="font-medium py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs ring-1 ring-indigo-100">
                            {user.firstName[0]}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-slate-900 font-bold">
                              {`${user.firstName} ${user.lastName}`}
                            </span>
                            <div className="flex items-center gap-1 text-[0.6rem] text-slate-400">
                              {expandedRowId === user._id ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                              <span>Click to {expandedRowId === user._id ? "collapse" : "expand"}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium whitespace-nowrap">
                        {user.phone}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ShieldCheck
                            size={14}
                            className={
                              user.roleId?.name === "Admin"
                                ? "text-amber-500"
                                : user.roleId?.name === "Teacher"
                                  ? "text-emerald-500"
                                  : "text-slate-400"
                            }
                          />
                          <span className="text-sm font-semibold text-slate-700">
                            {user.roleId?.name || "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.65rem] font-black uppercase tracking-widest border ${
                            user.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-rose-50 text-rose-700 border-rose-100"
                            }`}
                        >
                          {user.status === "ACTIVE" && <CheckCircle2 size={10} />}
                          {user.status !== "ACTIVE" && <XCircle size={10} />}
                          {user.status.toLowerCase()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-8" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full"
                            >
                              <MoreHorizontal className="h-4 w-4 text-slate-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[180px] rounded-xl shadow-xl border-slate-100 p-1"
                          >
                            <DropdownMenuLabel className="text-[0.65rem] text-slate-400 px-3 py-2 uppercase font-black tracking-widest">
                              User Actions
                            </DropdownMenuLabel>
                            <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-semibold focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer">
                              <Edit2 size={14} className="mr-2" />
                              Edit User
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleManageRole(user)}
                              className="rounded-lg px-3 py-2 text-sm font-semibold focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer"
                            >
                              <UserCog size={14} className="mr-2" />
                              Assign Role
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-slate-100" />

                            <DropdownMenuItem
                              onClick={() => handleDeleteUser(user._id)}
                              className="rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 focus:bg-rose-50 focus:text-rose-600 cursor-pointer"
                            >
                              <Trash2 size={14} className="mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>

                    <AnimatePresence>
                      {expandedRowId === user._id && (
                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                          <TableCell colSpan={6} className="p-0 border-none">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="p-6 border-b border-slate-100">
                                <div className="flex flex-wrap items-start gap-x-12 gap-y-6">
                                  {/* University Info */}
                                  <div className="space-y-1.5 min-w-[150px]">
                                    <span className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">University</span>
                                    <div className="flex flex-col gap-0.5">
                                      <span className="text-sm font-bold text-indigo-600 truncate max-w-[200px]">{user.universityId?.name || "Not assigned"}</span>
                                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                        <Globe size={12} className="text-indigo-400" />
                                        {user.universityId?.domain || "N/A"}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Joined Date */}
                                  <div className="space-y-1.5 min-w-[120px]">
                                    <span className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Member Since</span>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                      <Calendar size={14} className="text-slate-400" />
                                      {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                  </div>

                                  {/* Verification Status */}
                                  <div className="space-y-1.5 min-w-[140px]">
                                    <span className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Account Safety</span>
                                    {user.verificationStatus ? (
                                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                                        <BadgeCheck size={16} />
                                        <span>Verified Identity</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs">
                                        <Clock size={16} />
                                        <span>Pending Review</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Assigned Courses */}
                                  <div className="space-y-2 flex-1 min-w-[200px]">
                                    <span className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Assigned Courses</span>
                                    <div className="flex flex-wrap gap-2">
                                      {user.courseIds?.map((course: any) => (
                                        <span key={course._id} className="text-[0.6rem] font-black bg-white text-indigo-600 border border-indigo-100 px-2.5 py-1 rounded-md uppercase tracking-wide">
                                          {course.courseName}
                                        </span>
                                      ))}
                                      {!user.courseIds?.length && <span className="text-xs text-slate-400 italic">No courses currently linked</span>}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="p-5">
            <p className="text-sm text-slate-400 ">
              Total: {filteredUsers.length} users registered
            </p>
          </div>
        </CardContent>
      </Card>

      <AssignRoleDialog
        isOpen={isRoleDialogOpen}
        setIsOpen={setIsRoleDialogOpen}
        user={selectedUser}
      />
    </div>
  );
}

