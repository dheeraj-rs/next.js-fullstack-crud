'use client';
import React, { useState, useEffect } from 'react';
import Item from './components/Item';
import CardModal from './components/CardModal';

const Home = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/items');
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch items:', error);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        const res = await fetch(`/api/items/${currentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, description }),
        });
        const updatedItem = await res.json();
        setItems(
          items.map((item) => (item._id === currentId ? updatedItem : item))
        );
        setEditMode(false);
        setCurrentId(null);
      } else {
        const res = await fetch('/api/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, description }),
        });
        const newItem = await res.json();
        setItems([...items, newItem]);
      }
      setName('');
      setDescription('');
      setShowModal(false);
    } catch (error) {
      console.error('Failed to submit item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditMode(true);
    setName(item.name);
    setDescription(item.description);
    setCurrentId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });
      setItems(items.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const openModal = () => {
    setName('');
    setDescription('');
    setEditMode(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <main className="w-screen h-screen p-4 bg-[rgba(220,242,247,0.33)]">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">CRUD APP</h1>
        <button
          onClick={openModal}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Add Item
        </button>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items?.map((item) => (
            <Item
              key={item.id}
              item={item}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))}
        </ul>
        <CardModal
          show={showModal}
          onClose={closeModal}
          handleSubmit={handleSubmit}
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          editMode={editMode}
        />
      </div>
    </main>
  );
};

export default Home;
