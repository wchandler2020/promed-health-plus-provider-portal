import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../utils/auth";
import { FaRegEdit } from "react-icons/fa";

const ProviderProfileCard = () => {
  const { verifyToken } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { success, data } = await verifyToken(
        localStorage.getItem("accessToken")
      );
      if (success) {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [verifyToken]);

 console.log(profile)

  if (loading)
    return (
      <div className="text-center mt-20 text-gray-600 text-lg">Loading...</div>
    );
  if (!profile)
    return (
      <div className="text-center mt-20 text-red-500 text-lg">
        Profile not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-10 px-4">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-3xl">
        <div className="relative flex flex-col items-center py-10 px-6">
          <img
            src={
              profile.image?.startsWith("http")
                ? profile.image
                : `${process.env.REACT_APP_MEDIA_URL}${profile.image}`
            }
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg transform transition-transform duration-300 hover:scale-105 mt-2"
          />
          <h1 className="mt-4 text-2xl md:text-3xl font-extrabold text-gray-800">
            {profile.full_name || profile.user?.full_name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {profile.city}, {profile.country}
          </p>

          <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
            <FaRegEdit />
            Edit Profile
          </button>

          <div className="mt-8 w-full border-t border-gray-200 pt-6 text-left">
            <h3 className="text-lg font-bold text-gray-700 mb-2">Bio</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {profile.bio || "No bio provided."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfileCard;
