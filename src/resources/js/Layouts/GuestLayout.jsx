export default function GuestLayout({ children }) {
    return (
        <div className="GuestLayout min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <div>
                <a href="/">
                    <h1 className="text-3xl font-bold text-gray-900">Xman form guest layout</h1>
                </a>
            </div>

            <div id="xman-child" className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}