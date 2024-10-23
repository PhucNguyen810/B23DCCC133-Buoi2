import React, { useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { createStore } from 'redux';
import './App.css'; 
const initialState = { items: [] };

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_ITEM':
            return { ...state, items: [...state.items, action.payload] };
        case 'REMOVE_ITEM':
            return { ...state, items: state.items.filter((_, index) => index !== action.payload) };
        case 'EDIT_ITEM':
            const updatedItems = state.items.map((item, index) =>
                index === action.payload.index ? action.payload.newItem : item
            );
            return { ...state, items: updatedItems };
        default:
            return state;
    }
};

const store = createStore(reducer);
const App = () => {
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [editIndex, setEditIndex] = useState(null); 
    const itemsPerPage = 3;
    const items = useSelector(state => state.items);
    const dispatch = useDispatch();

    const addItem = () => {
        if (itemName && itemPrice) {
            dispatch({ type: 'ADD_ITEM', payload: { name: itemName, price: itemPrice } });
            resetFields();
        }
    };

    const editItem = (index) => {
        const itemToEdit = items[index];
        setItemName(itemToEdit.name);
        setItemPrice(itemToEdit.price);
        setEditIndex(index);
    };

    const updateItem = () => {
        if (itemName && itemPrice && editIndex !== null) {
            dispatch({ type: 'EDIT_ITEM', payload: { index: editIndex, newItem: { name: itemName, price: itemPrice } } });
            resetFields();
        }
    };

    const removeItem = (index) => {
        dispatch({ type: 'REMOVE_ITEM', payload: index });
    };

    const resetFields = () => {
        setItemName('');
        setItemPrice('');
        setEditIndex(null);
    };

    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="app-container">
            <div className="sidebar">
                <h2>Quản lý hàng hoá</h2>
            </div>
            <div className="main-content">
                <div className="input-group">
                    <input
                        type="text"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        placeholder="Nhập tên hàng hoá"
                        className="input-field"
                    />
                    <input
                        type="number"
                        value={itemPrice}
                        onChange={(e) => setItemPrice(e.target.value)}
                        placeholder="Nhập giá hàng hoá"
                        className="input-field"
                    />
                    {editIndex !== null ? (
                        <button onClick={updateItem} className="add-button">Cập nhật hàng hoá</button>
                    ) : (
                        <button onClick={addItem} className="add-button">Thêm hàng hoá</button>
                    )}
                </div>
                
                <div className="search-group">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value )}
                        placeholder="Tìm kiếm hàng hoá"
                        className="input-field"
                    />
                </div>
                
                <h3>Danh sách hàng hoá:</h3>
                <ul className="item-list">
                    {currentItems.map((item, index) => (
                        <li key={index} className="item">
                            {item.name} - {item.price} VND
                            <button onClick={() => removeItem(index)} className="delete-button">Xoá</button>
                            <button onClick={() => editItem(index)} className="edit-button">Chỉnh sửa</button>
                        </li>
                    ))}
                </ul>

                <div className="pagination">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                        disabled={currentPage === 1}
                    >
                        Trước
                    </button>
                    <span>Trang {currentPage} / {totalPages}</span>
                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                        disabled={currentPage === totalPages}
                    >
                        Tiếp
                    </button>
                </div>
            </div>
        </div>
    );
};
const Root = () => (
    <Provider store={store}>
        <App />
    </Provider>
);
export default Root;