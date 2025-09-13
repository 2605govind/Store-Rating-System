const Form = ({ title, formData, setFormData, onSubmit, isStore = false, error }) => {
    return (
        <div className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Name"
                    className="w-full px-3 py-2 rounded bg-gray-700 text-white"
                    value={formData?.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-3 py-2 rounded bg-gray-700 text-white"
                    value={formData?.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Address"
                    className="w-full px-3 py-2 rounded bg-gray-700 text-white"
                    value={formData?.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
                {!isStore && (
                    <input
                        type="text"
                        placeholder="Password"
                        className="w-full px-3 py-2 rounded bg-gray-700 text-white"
                        value={formData?.password}
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                    />
                )}
                {isStore && (
                    <input
                        type="text"
                        placeholder="Owner ID"
                        className="w-full px-3 py-2 rounded bg-gray-700 text-white"
                        value={formData?.owner_id}
                        onChange={(e) =>
                            setFormData({ ...formData, owner_id: e.target.value })
                        }
                    />
                )}

                {error && (
                    <div className="mb-4 text-red-400 text-sm text-center">
                        {error.response?.data?.message}
                    </div>
                )}
                <button
                    onClick={onSubmit}
                    className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default Form;