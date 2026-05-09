import React, { useState } from "react"
import { useSelector } from "react-redux"
import Title from "../components/Title"
import AddUser from "../components/AddUser"
import ChangePassword from "../components/ChangePassword"
import Button from "../components/Button"
import { FaUser, FaUserLock } from "react-icons/fa"

const Settings = () => {
    const { user } = useSelector((state) => state.auth)
    const [openProfile, setOpenProfile] = useState(false)
    const [openPassword, setOpenPassword] = useState(false)

    return (
        <div className="w-full">
            <Title title="Settings" />

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Settings Card */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
                            <FaUser className="text-white text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">
                                Profile Settings
                            </h3>
                            <p className="text-gray-500 text-sm">
                                Manage your profile information
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div>
                            <label className="text-sm text-gray-600">Name</label>
                            <p className="text-gray-800 font-semibold">
                                {user?.name}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Email</label>
                            <p className="text-gray-800 font-semibold">
                                {user?.email}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Title</label>
                            <p className="text-gray-800 font-semibold">
                                {user?.title || "Not set"}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Role</label>
                            <p className="text-gray-800 font-semibold">
                                {user?.isAdmin ? "Administrator" : "User"}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Status</label>
                            <p className="text-gray-800 font-semibold">
                                {user?.isActive ? (
                                    <span className="text-green-600">Active</span>
                                ) : (
                                    <span className="text-red-600">Inactive</span>
                                )}
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={() => setOpenProfile(true)}
                        label="Edit Profile"
                        className="w-full bg-blue-600 text-white rounded-md py-2.5 font-semibold hover:bg-blue-700 transition"
                    />
                </div>

                {/* Security Settings Card */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center">
                            <FaUserLock className="text-white text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">
                                Security Settings
                            </h3>
                            <p className="text-gray-500 text-sm">
                                Manage your account security
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-gray-700">
                                <strong>Password:</strong> Change your password
                                regularly to keep your account secure.
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={() => setOpenPassword(true)}
                        label="Change Password"
                        className="w-full bg-green-600 text-white rounded-md py-2.5 font-semibold hover:bg-green-700 transition"
                    />
                </div>
            </div>

            <AddUser open={openProfile} setOpen={setOpenProfile} userData={user} />
            <ChangePassword open={openPassword} setOpen={setOpenPassword} />
        </div>
    )
}

export default Settings
