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

const users = [
  {
    id: "1",
    name: "Aarav Sharma",
    email: "aarav@university.edu",
    phone: "+91 9876543210",
    universityName: "LPU University",
    courseName: "B.Tech CSE",
    semester: "Semester 4",
    role: "Admin",
    status: "Active",
  },
  {
    id: "2",
    name: "Ishani Gupta",
    email: "ishani@university.edu",
    phone: "+91 9876543211",
    universityName: "Delhi University",
    courseName: "B.Sc Physics",
    semester: "Semester 2",
    role: "Teacher",
    status: "Active",
  },
  {
    id: "3",
    name: "Vihaan Reddy",
    email: "vihaan@student.edu",
    phone: "+91 9876543212",
    universityName: "Anna University",
    courseName: "B.E ECE",
    semester: "Semester 6",
    role: "Student",
    status: "Pending",
  },
  {
    id: "4",
    name: "Ananya Iyer",
    email: "ananya@university.edu",
    phone: "+91 9876543213",
    universityName: "Mumbai University",
    courseName: "B.Com",
    semester: "Semester 3",
    role: "Support",
    status: "Disabled",
  },
  {
    id: "5",
    name: "Kabir Verma",
    email: "kabir@student.edu",
    phone: "+91 9876543214",
    universityName: "LPU University",
    courseName: "B.Tech CSE",
    semester: "Semester 1",
    role: "Student",
    status: "Active",
  },
];

export default function UserList() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isRoleDialogOpen, setIsRoleDialogOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<any>(null);

  const handleManageRole = (user: any) => {
    setSelectedUser(user);
    setIsRoleDialogOpen(true);
  };
  
  // API CALL PLACE: Fetch users data from backend
  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     const response = await fetch('/api/users');
  //     const data = await response.json();
  //     setUsers(data);
  //   };
  //   fetchUsers();
  // }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  <TableHead className="font-bold text-white">Course</TableHead>
                  <TableHead className="font-bold text-white">University</TableHead>
                  <TableHead className="font-bold text-white">Role</TableHead>
                  <TableHead className="font-bold text-white">Status</TableHead>
                  <TableHead className="text-right font-bold text-white pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="group hover:bg-slate-50/50 transition-colors border-slate-100"
                  >
                    <TableCell className="font-medium py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs ring-1 ring-indigo-100">
                          {user.name[0]}
                        </div>
                        <span className="text-slate-900 font-bold block">
                          {user.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium whitespace-nowrap">
                      {user.phone}
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium whitespace-nowrap">
                      {user.courseName}
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium whitespace-nowrap">
                      {user.universityName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ShieldCheck
                          size={14}
                          className={
                            user.role === "Admin"
                              ? "text-amber-500"
                              : user.role === "Teacher"
                              ? "text-emerald-500"
                              : "text-slate-400"
                          }
                        />
                        <span className="text-sm font-semibold text-slate-700">
                          {user.role}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.65rem] font-black uppercase tracking-widest border ${
                          user.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : user.status === "Pending"
                            ? "bg-blue-50 text-blue-700 border-blue-100"
                            : "bg-rose-50 text-rose-700 border-rose-100"
                        }`}
                      >
                        {user.status === "Active" && <CheckCircle2 size={10} />}
                        {user.status === "Pending" && <Clock size={10} />}
                        {user.status === "Disabled" && <XCircle size={10} />}
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-8">
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
                          {/* API CALL PLACE: Edit User */}
                          <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-semibold focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer">
                            <Edit2 size={14} className="mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          
                          {/* Assign Role action */}
                          <DropdownMenuItem 
                            onClick={() => handleManageRole(user)}
                            className="rounded-lg px-3 py-2 text-sm font-semibold focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer"
                          >
                            <UserCog size={14} className="mr-2" />
                            Assign Role
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator className="bg-slate-100" />
                          
                          {/* API CALL PLACE: Delete User */}
                          <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 focus:bg-rose-50 focus:text-rose-600 cursor-pointer">
                            <Trash2 size={14} className="mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
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

