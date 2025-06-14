import React from 'react';
import Sidebar from './Sidebar.jsx';

const Profile = () => {
    const user = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        bio: 'Frontend developer. Coffee enthusiast. Cat lover.',
        avatar: 'https://i.pravatar.cc/150?img=3',
        location: 'New York, NY',
        website: 'https://example.com',
        github: 'https://github.com/janedoe',
        followers: 123,
        following: 456,
        posts: 789
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-100 to-blue-100">
            <Sidebar />
            <div className="flex flex-col justify-center items-center flex-1 px-4">
                <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl transition-transform duration-300 transform hover:scale-[1.01]">
                    <div className="flex justify-center mb-4">
                        <img
                            src={user.avatar}
                            alt="Avatar"
                            className="w-28 h-28 rounded-full shadow-lg border-4 border-blue-200"
                        />
                    </div>
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-1">{user.name}</h2>
                    <p className="text-center text-gray-500 mb-4">{user.email}</p>

                    <div className="space-y-2 text-sm text-gray-600">
                        <p className="flex justify-between">
                            <span>📍 Location:</span>
                            <span className="text-right">{user.location}</span>
                        </p>
                        <p className="flex justify-between">
                            <span>🌐 Website:</span>
                            <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-right truncate max-w-[50%]">
                                {user.website}
                            </a>
                        </p>
                        <p className="flex justify-between">
                            <span>🐙 GitHub:</span>
                            <a href={user.github} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-right truncate max-w-[50%]">
                                {user.github}
                            </a>
                        </p>
                        <p className="flex justify-between">
                            <span>👥 Followers:</span>
                            <span>{user.followers}</span>
                        </p>
                        <p className="flex justify-between">
                            <span>➡️ Following:</span>
                            <span>{user.following}</span>
                        </p>
                        <p className="flex justify-between">
                            <span>📝 Posts:</span>
                            <span>{user.posts}</span>
                        </p>
                    </div>

                    <div className="mt-6">
                        <p className="text-center italic text-gray-700">{user.bio}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
