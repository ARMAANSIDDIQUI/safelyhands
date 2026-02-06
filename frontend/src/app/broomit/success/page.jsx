import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function SuccessPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-4 font-display">Booking Successful!</h1>
                        <p className="text-slate-600 mb-8 text-lg">
                            Thank you for choosing Safely Hands. Our team will review your request and assign a professional shortly.
                        </p>
                <Link
                    href="/"
                    className="block w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
                >
                    Return Home
                </Link>
            </div>
        </main>
    );
}
