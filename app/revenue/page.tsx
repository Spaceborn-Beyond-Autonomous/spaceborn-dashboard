import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Construction, Clock } from 'lucide-react';

export default function RevenuePage() {

    interface User {
        id: string;
        name: string;
        email: string;
        role: 'admin' | 'core' | 'employee';
    }

    const adminUser: User = {
        id: "1",
        name: "Admin User",
        email: "admin@spaceborn.com",
        role: "admin"
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar user={adminUser} />
            <div className="flex-1 md:ml-64">
                <Header user={adminUser} title="Revenue" />
                <main className="p-6">
                    <div className="flex items-center justify-center min-h-[600px]">
                        <div className="text-center max-w-lg">
                            <div className="relative mb-8">
                                <div className="w-32 h-32 mx-auto rounded-full bg-[#1a1a1a] border-2 border-[#222] flex items-center justify-center">
                                    <Construction className="h-16 w-16 text-white animate-pulse" />
                                </div>
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                                    <div className="bg-yellow-500/20 text-yellow-400 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wide flex items-center gap-2">
                                        <Clock className="h-3 w-3 animate-spin" />
                                        In Development
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold text-white mb-4">
                                Work in Progress
                            </h2>

                            <p className="text-[#aaa] text-lg mb-6 leading-relaxed">
                                We're building something amazing for you. This revenue tracking feature
                                is currently under development and will be available soon.
                            </p>

                            <div className="bg-[#111] border border-[#222] rounded-lg p-6 text-left">
                                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Coming Soon
                                </h3>
                                <ul className="space-y-2 text-sm text-[#aaa]">
                                    <li className="flex items-start gap-2">
                                        <span className="text-white mt-0.5">•</span>
                                        <span>Real-time revenue tracking and analytics</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-white mt-0.5">•</span>
                                        <span>Automated revenue calculations by project</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-white mt-0.5">•</span>
                                        <span>Detailed financial reports and insights</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-white mt-0.5">•</span>
                                        <span>Role-based access for team members</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
