import React, { useState, useEffect } from 'react';
import { useGetRoomsQuery, useSaveRoomsConfigMutation } from '../../redux/api/orderApi';
import toast from 'react-hot-toast';

const RoomConfigLayout = () => {
  const { data: fetchedRooms = [], isLoading, isError } = useGetRoomsQuery();
  const [saveRoomsConfig, { isLoading: isSaving }] = useSaveRoomsConfigMutation();

  const [rooms, setRooms] = useState([]);

  // Sync fetched data to local state
  useEffect(() => {
    if (fetchedRooms.length) {
        const cloned = JSON.parse(JSON.stringify(fetchedRooms?.[0]?.rooms));
      setRooms(cloned);
    }
  }, [fetchedRooms]);

  const handleChange = (index, key, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[index][key] = value;
    setRooms(updatedRooms);
  };

  const handleAddRoom = () => {
    const lastRoomNo = rooms.length ? rooms[rooms.length - 1].roomNo : 200;
    setRooms([...rooms, { desks: 20, columns: 4, roomNo: lastRoomNo + 1 }]);
  };

  const handleRemoveRoom = (index) => {
    const updatedRooms = [...rooms];
    updatedRooms.splice(index, 1);
    setRooms(updatedRooms);
  };

  const handleSave = async () => {
    try {
      await saveRoomsConfig({ rooms }).unwrap();
      toast.success('Room configuration saved successfully!');
    } catch (error) {
      console.error('Error saving rooms:', error);
      toast.error('Failed to save. Please try again.');
    }
  };

  if (isLoading) return <p style={{ textAlign: 'center' }}>Loading room configuration...</p>;
  if (isError) return <p style={{ textAlign: 'center', color: 'red' }}>Failed to load data.</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto', fontFamily: 'Arial' }}>
      <h2 style={{ textAlign: 'center' }}>🛠️ Room Configuration</h2>
      
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
        <thead style={{ backgroundColor: '#f1f1f1' }}>
          <tr>
            <th style={th}>#</th>
            <th style={th}>Room No</th>
            <th style={th}>Desks</th>
            <th style={th}>Columns</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, index) => (
            <tr key={index}>
              <td style={td}>{index + 1}</td>
              <td style={td}>
                <input
                  type="number"
                  value={room.roomNo}
                  onChange={(e) => handleChange(index, 'roomNo', parseInt(e.target.value))}
                  style={input}
                />
              </td>
              <td style={td}>
                <select
                  value={room.desks}
                  onChange={(e) => handleChange(index, 'desks', parseInt(e.target.value))}
                  style={input}
                >
                  {[...Array(50)].map((_, i) => (
                    <option key={i} value={i + 1}>{i + 1} Desks</option>
                  ))}
                </select>
              </td>
              <td style={td}>
                <input
                  type="number"
                  value={room.columns}
                  onChange={(e) => handleChange(index, 'columns', parseInt(e.target.value))}
                  style={input}
                />
              </td>
              <td style={td}>
                <button onClick={() => handleRemoveRoom(index)} style={deleteBtn}>
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        <button onClick={handleAddRoom} style={addBtn}>➕ Add Room</button>
        <button onClick={handleSave} disabled={isSaving} style={saveBtn}>
          {isSaving ? 'Saving...' : '💾 Save Configuration'}
        </button>
      </div>
    </div>
  );
};

const th = {
  padding: '10px',
  border: '1px solid #ccc',
  fontWeight: 'bold'
};

const td = {
  padding: '10px',
  border: '1px solid #ccc'
};

const input = {
  padding: '6px',
  width: '100%',
  boxSizing: 'border-box'
};

const addBtn = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '10px 16px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const saveBtn = {
  backgroundColor: '#2196F3',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const deleteBtn = {
  backgroundColor: '#f44336',
  color: 'white',
  padding: '6px 12px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default RoomConfigLayout;
