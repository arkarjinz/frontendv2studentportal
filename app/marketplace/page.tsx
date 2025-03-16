'use client';

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getLoggedInUser, getLoggedInUerRole } from "@/service/AuthService";
import { MarketplaceItemDto, ExchangeHistoryDto } from "@/ds/marketplace.dto";
import {
    createMarketplaceItem,
    updateMarketplaceItem,
    deleteMarketplaceItem,
    getAllMarketplaceItems,
    exchangeItem,
    getExchangeHistory
} from "@/service/MarketplaceService";
import { AnimatePresence, motion } from "framer-motion";
import {
    FiBox,
    FiClock,
    FiDollarSign,
    FiEdit,
    FiImage,
    FiPlus,
    FiShoppingBag,
    FiTag,
    FiTrash,
    FiType
} from "react-icons/fi";
import { GiPayMoney, GiPlantRoots, GiReceiveMoney } from "react-icons/gi";

export default function MarketplaceComponent() {
    const router = useRouter();
    const loggedInUser = getLoggedInUser();
    const loggedInUserRole = getLoggedInUerRole();
    const isAdmin = loggedInUserRole.trim() === "ROLE_ADMIN";
    const [showHistory, setShowHistory] = useState(false);
    const [showAdminForm, setShowAdminForm] = useState(false);

    // Admin form state
    const [itemForm, setItemForm] = useState({
        name: "",
        description: "",
        quantity: 0,
        price: 0,
        category: "",
        image: null as File | null,
    });
    const [editingItemId, setEditingItemId] = useState<number | null>(null);

    // Marketplace items state
    const [items, setItems] = useState<MarketplaceItemDto[]>([]);
    // For exchange, track desired quantity for each item
    const [exchangeQuantity, setExchangeQuantity] = useState<{ [key: number]: number }>({});
    // Exchange history state
    const [exchangeHistory, setExchangeHistory] = useState<ExchangeHistoryDto[]>([]);

    // New state for confirm exchange modal
    const [showConfirmExchangeModal, setShowConfirmExchangeModal] = useState(false);
    const [confirmExchangeItemId, setConfirmExchangeItemId] = useState<number | null>(null);
    const [confirmExchangeQty, setConfirmExchangeQty] = useState<number>(0);

    const fetchItems = useCallback(() => {
        getAllMarketplaceItems()
            .then((res) => setItems(res.data))
            .catch((err) => console.error(err));
    }, []);

    const fetchExchangeHistory = useCallback(() => {
        getExchangeHistory(loggedInUser)
            .then((res) => setExchangeHistory(res.data))
            .catch((err) => console.error(err));
    }, [loggedInUser]);

    useEffect(() => {
        fetchItems();
        fetchExchangeHistory();
    }, [fetchItems, fetchExchangeHistory]);

    // Admin: create/update item form submit
    const handleItemFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", itemForm.name);
        formData.append("description", itemForm.description);
        formData.append("quantity", itemForm.quantity.toString());
        formData.append("price", itemForm.price.toString());
        formData.append("category", itemForm.category);
        if (itemForm.image) {
            formData.append("image", itemForm.image);
        }
        if (editingItemId === null) {
            createMarketplaceItem(formData)
                .then(() => {
                    setItemForm({ name: "", description: "", quantity: 0, price: 0, category: "", image: null });
                    fetchItems();
                })
                .catch((err) => console.error(err));
        } else {
            updateMarketplaceItem(editingItemId, formData)
                .then(() => {
                    setEditingItemId(null);
                    setItemForm({ name: "", description: "", quantity: 0, price: 0, category: "", image: null });
                    fetchItems();
                })
                .catch((err) => console.error(err));
        }
    };

    // Update delete handler to remove username parameter
    const handleDeleteItem = (id: number) => {
        deleteMarketplaceItem(id) // Remove username parameter
            .then(() => fetchItems())
            .catch((err) => {
                console.error("Delete error:", err);
                alert(`Failed to delete item: ${err.response?.data?.message || 'Server error'}`);
            });
    };

    // User: initiate exchange by showing a confirm modal
    const handleExchange = (id: number) => {
        const qty = exchangeQuantity[id] || 0;
        if (qty <= 0) return;
        const item = items.find((item) => item.id === id);
        if (item && qty > item.quantity) {
            alert(`You cannot exchange more than ${item.quantity} items.`);
            return;
        }
        // Open confirm exchange modal
        setConfirmExchangeItemId(id);
        setConfirmExchangeQty(qty);
        setShowConfirmExchangeModal(true);
    };

    // Confirm exchange modal action
    const confirmExchange = () => {
        if (confirmExchangeItemId === null) return;
        exchangeItem(confirmExchangeItemId, loggedInUser, confirmExchangeQty)
            .then((res) => {
                // If response indicates insufficient balance, show alert
                if (res.data && typeof res.data === "string" && res.data.includes("Insufficient rose balance")) {
                    alert("Not enough roses to complete the exchange.");
                }
                fetchItems();
                fetchExchangeHistory();
                setExchangeQuantity((prev) => ({ ...prev, [confirmExchangeItemId!]: 0 }));
                setShowConfirmExchangeModal(false);
                setConfirmExchangeItemId(null);
                setConfirmExchangeQty(0);
            })
            .catch((err) => {
                console.error(err);
                alert("Exchange failed. Please try again.");
            });
    };

    return (
        <div className="min-h-screen  p-6">
            {/* Floating Action Buttons */}
            <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
                {!isAdmin && (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowHistory(!showHistory)}
                        className="p-4 bg-emerald-600 text-white rounded-full shadow-xl"
                    >
                        <FiClock className="text-2xl" />
                    </motion.button>
                )}
                {isAdmin && (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            setShowAdminForm(true);
                            if (!editingItemId) {
                                setItemForm({ name: "", description: "", quantity: 0, price: 0, category: "", image: null });
                            }
                        }}
                        className="p-4 bg-emerald-600 text-white rounded-full shadow-xl"
                    >
                        <FiPlus className="text-2xl" />
                    </motion.button>
                )}
            </div>

            {/* Admin Form Modal */}
            <AnimatePresence>
                {showAdminForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-emerald-800">
                                    {editingItemId ? "Edit Item" : "New Item"}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowAdminForm(false);
                                        setEditingItemId(null);
                                    }}
                                >
                                    <FiPlus className="rotate-45 text-2xl text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleItemFormSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-emerald-700 font-medium">
                                        <FiType className="text-lg" />
                                        Item Name
                                    </label>
                                    <input
                                        type="text"
                                        value={itemForm.name}
                                        onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                                        className="w-full p-3 rounded-lg border-2 border-emerald-100 focus:border-emerald-400"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-emerald-700 font-medium">
                                        <FiEdit className="text-lg" />
                                        Description
                                    </label>
                                    <textarea
                                        value={itemForm.description}
                                        onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                                        className="w-full p-3 rounded-lg border-2 border-emerald-100 focus:border-emerald-400 h-32"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-emerald-700 font-medium">
                                            <FiBox className="text-lg" />
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            value={itemForm.quantity}
                                            onChange={(e) => setItemForm({ ...itemForm, quantity: parseInt(e.target.value) })}
                                            className="w-full p-3 rounded-lg border-2 border-emerald-100 focus:border-emerald-400"
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-emerald-700 font-medium">
                                            <FiDollarSign className="text-lg" />
                                            Price (in roses)
                                        </label>
                                        <input
                                            type="number"
                                            value={itemForm.price}
                                            onChange={(e) => setItemForm({ ...itemForm, price: parseInt(e.target.value) })}
                                            className="w-full p-3 rounded-lg border-2 border-emerald-100 focus:border-emerald-400"
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-emerald-700 font-medium">
                                        <FiTag className="text-lg" />
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        value={itemForm.category}
                                        onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                                        className="w-full p-3 rounded-lg border-2 border-emerald-100 focus:border-emerald-400"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-emerald-700 font-medium">
                                        <FiImage className="text-lg" />
                                        Item Image
                                    </label>
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-emerald-100 border-dashed rounded-lg cursor-pointer hover:border-emerald-400 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <FiImage className="w-8 h-8 text-emerald-300 mb-2" />
                                            <p className="text-sm text-emerald-500">
                                                {itemForm.image ? itemForm.image.name : "Click to upload image"}
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            onChange={(e) =>
                                                setItemForm({ ...itemForm, image: e.target.files ? e.target.files[0] : null })
                                            }
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    {editingItemId ? (
                                        <>
                                            <FiEdit className="text-lg" />
                                            Update Item
                                        </>
                                    ) : (
                                        <>
                                            <FiPlus className="text-lg" />
                                            Create Item
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto">
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <GiPlantRoots className="text-6xl text-emerald-600 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-emerald-900 mb-2">Green Marketplace</h1>
                    <p className="text-emerald-700">Exchange your roses for sustainable solutions</p>
                </motion.header>

                {/* Marketplace Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                        >
                            <div className="relative h-48 w-full">
                                {item.imageBase64 ? (
                                    <Image
                                        src={`data:image/*;base64,${item.imageBase64}`}
                                        alt={item.name}
                                        fill
                                        className="object-cover rounded"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-emerald-50 flex items-center justify-center">
                                        <FiShoppingBag className="text-3xl text-emerald-200" />
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-semibold text-emerald-900">{item.name}</h3>
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                                        {item.category}
                                    </span>
                                </div>

                                <p className="text-emerald-700 mb-4">{item.description}</p>

                                <div className="flex justify-between items-center mb-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-emerald-600">
                                            <GiPayMoney className="text-xl" />
                                            <span className="font-medium">{item.price} roses</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-emerald-600">
                                            <FiShoppingBag className="text-xl" />
                                            <span className="font-medium">
                                                {item.quantity > 0 ? item.quantity : "0 left"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* For regular users, show exchange controls if quantity available */}
                                {!isAdmin && item.quantity > 0 && (
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            min="1"
                                            max={item.quantity}
                                            placeholder="Qty"
                                            value={exchangeQuantity[item.id!] || ""}
                                            onChange={(e) =>
                                                setExchangeQuantity((prev) => ({
                                                    ...prev,
                                                    [item.id!]: Math.min(parseInt(e.target.value) || 1, item.quantity)
                                                }))
                                            }
                                            className="w-full p-2 border-2 border-emerald-100 rounded-lg"
                                        />
                                        <button
                                            onClick={() => handleExchange(item.id!)}
                                            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center gap-2"
                                        >
                                            <GiReceiveMoney className="text-xl" />
                                            <span>Exchange</span>
                                        </button>
                                    </div>
                                )}

                                {/* For admin, show edit and delete buttons */}
                                {isAdmin && (
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => {
                                                setEditingItemId(item.id!);
                                                setShowAdminForm(true);
                                                setItemForm({
                                                    name: item.name,
                                                    description: item.description,
                                                    quantity: item.quantity,
                                                    price: item.price,
                                                    category: item.category,
                                                    image: null,
                                                });
                                            }}
                                            className="flex-1 py-2 bg-amber-500 text-white rounded-lg flex items-center justify-center gap-2"
                                        >
                                            <FiEdit />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteItem(item.id!)}
                                            className="flex-1 py-2 bg-rose-500 text-white rounded-lg flex items-center justify-center gap-2"
                                        >
                                            <FiTrash />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Confirm Exchange Modal */}
            <AnimatePresence>
                {showConfirmExchangeModal && confirmExchangeItemId !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    >
                        <motion.div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg">
                            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Confirm Exchange</h2>
                            {(() => {
                                const item = items.find((i) => i.id === confirmExchangeItemId);
                                if (!item) return null;
                                const totalCost = item.price * confirmExchangeQty;
                                return (
                                    <div className="space-y-4">
                                        <p className="text-lg text-emerald-700">
                                            Exchange {confirmExchangeQty} x <span className="font-bold">{item.name}</span> for <span className="font-bold">{totalCost}</span> roses?
                                        </p>
                                        <div className="flex justify-end gap-4">
                                            <button
                                                onClick={() => {
                                                    setShowConfirmExchangeModal(false);
                                                    setConfirmExchangeItemId(null);
                                                    setConfirmExchangeQty(0);
                                                }}
                                                className="px-4 py-2 bg-gray-300 rounded"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={confirmExchange}
                                                className="px-4 py-2 bg-emerald-600 text-white rounded"
                                            >
                                                Confirm
                                            </button>
                                        </div>
                                    </div>
                                );
                            })()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* History Sidebar (only for regular users) */}
            {!isAdmin && (
                <AnimatePresence>
                    {showHistory && (
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 right-0 h-screen w-full max-w-md bg-white shadow-xl z-50 p-6"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-emerald-900 flex items-center gap-3">
                                    <FiClock className="text-emerald-600" />
                                    Exchange History
                                </h2>
                                <button
                                    onClick={() => setShowHistory(false)}
                                    className="p-2 hover:bg-emerald-50 rounded-full"
                                >
                                    <FiPlus className="rotate-45 text-2xl text-gray-500" />
                                </button>
                            </div>

                            {exchangeHistory.length === 0 ? (
                                <div className="text-center py-12 text-emerald-600">
                                    <FiClock className="text-4xl mx-auto mb-4" />
                                    <p>No exchanges yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4 overflow-y-auto h-[calc(100vh-160px)] pr-4">
                                    {exchangeHistory.map((history) => (
                                        <div key={history.id} className="bg-emerald-50 p-4 rounded-xl">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold text-emerald-900">{history.itemName}</h4>
                                                <span className="text-sm text-emerald-600">
                                                    {new Date(history.exchangeDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-emerald-700">
                                                <div className="flex items-center gap-2">
                                                    <FiShoppingBag />
                                                    {history.quantityExchanged}x
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <GiPayMoney />
                                                    {history.totalRosesSpent} roses
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}
