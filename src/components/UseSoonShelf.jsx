import React, { useState } from 'react';
import { Clock, AlertTriangle, Plus, Check, Trash2, ArrowUpRight, ShieldAlert } from 'lucide-react';

export function UseSoonShelf({
  useSoonItems,
  onAddIngredientToSearch,
  onRemoveItem,
  onAddNewItem
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDays, setNewDays] = useState(2);
  const [newQuantity, setNewQuantity] = useState('');
  const [newCategory, setNewCategory] = useState('Produce');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddNewItem({
      id: `us-custom-${Date.now()}`,
      name: newName.trim(),
      quantity: newQuantity.trim() || '1 item',
      category: newCategory,
      daysLeft: parseInt(newDays, 10) || 1,
      storageTip: 'Store properly sealed and keep in refrigerator to maintain freshness.'
    });

    setNewName('');
    setNewQuantity('');
    setNewDays(2);
    setShowAddForm(false);
  };

  const getUrgencyBadge = (days) => {
    if (days <= 1) {
      return (
        <span className="days-left-badge badge-urgent-red">
          <Clock size={12} />
          <span>{days === 0 ? 'Expires Today!' : '1 day left!'}</span>
        </span>
      );
    }
    if (days <= 3) {
      return (
        <span className="days-left-badge badge-urgent-orange">
          <Clock size={12} />
          <span>{days} days left</span>
        </span>
      );
    }
    return (
      <span className="days-left-badge badge-urgent-green">
        <Clock size={12} />
        <span>{days} days left</span>
      </span>
    );
  };

  const getUrgencyClass = (days) => {
    if (days <= 1) return 'urgent-1';
    if (days <= 3) return 'urgent-2';
    return 'urgent-3';
  };

  return (
    <section id="use-soon" className="use-soon-section">
      <div className="section-badge-header">
        <div className="use-soon-title-wrap">
          <div className="use-soon-icon-badge">
            <Clock size={22} />
          </div>
          <div>
            <h2 className="section-title">"Use Soon" Shelf</h2>
            <p className="section-desc">
              Track ingredients nearing their expiration so you cook them before they spoil.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="form-toggle-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={16} />
          <span>{showAddForm ? 'Close Add Form' : '+ Add Item to Tracker'}</span>
        </button>
      </div>

      {/* Critical Food Safety Notice Required by Project Guidelines */}
      <div className="critical-safety-banner">
        <AlertTriangle size={20} className="safety-banner-icon" />
        <div className="safety-banner-text">
          <strong>Important Safety Rule:</strong> Never eat food that smells sour, feels slimy, or shows mold. 
          Do <em>not</em> assume an ingredient is safe simply because it has not reached its printed expiry date. 
          Improper storage or temperature fluctuations can cause spoilage earlier. When in doubt, discard it safely!
        </div>
      </div>

      {/* Add New Item Form Drawer */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="add-use-soon-form">
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1b4332', marginBottom: '0.5rem' }}>
            Add an ingredient approaching expiry:
          </div>
          <div className="add-item-inputs-row">
            <input
              type="text"
              placeholder="Ingredient name (e.g. Yogurt, Spinach, Eggs)"
              className="form-input"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Quantity (e.g. 2 cups, 1 pack)"
              className="form-input"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
            />
            <select
              className="form-input"
              value={newDays}
              onChange={(e) => setNewDays(e.target.value)}
            >
              <option value="1">1 day left (Urgent)</option>
              <option value="2">2 days left</option>
              <option value="3">3 days left</option>
              <option value="4">4 days left</option>
              <option value="5">5 days left</option>
            </select>
            <button type="submit" className="btn-submit-item">
              <Check size={16} />
              <span>Save</span>
            </button>
          </div>
        </form>
      )}

      {/* Shelf Grid Cards */}
      {useSoonItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          Your "Use Soon" shelf is empty! Add ingredients from your fridge or pantry to track them.
        </div>
      ) : (
        <div className="use-soon-grid">
          {useSoonItems.map((item) => (
            <div key={item.id} className={`use-soon-card ${getUrgencyClass(item.daysLeft)}`}>
              <div>
                <div className="use-soon-card-top">
                  <div>
                    <h3 className="use-soon-item-name">{item.name}</h3>
                    <div className="use-soon-category">
                      {item.category} • {item.quantity}
                    </div>
                  </div>
                  {getUrgencyBadge(item.daysLeft)}
                </div>

                {item.storageTip && (
                  <div className="use-soon-storage-tip">
                    💡 {item.storageTip}
                  </div>
                )}
              </div>

              <div className="use-soon-card-actions">
                <button
                  type="button"
                  className="btn-add-to-search"
                  onClick={() => onAddIngredientToSearch(item.name)}
                  title={`Find recipes using ${item.name}`}
                >
                  <ArrowUpRight size={14} />
                  <span>Use in Recipe</span>
                </button>

                <button
                  type="button"
                  className="btn-dismiss-item"
                  onClick={() => onRemoveItem(item.id)}
                  title="Mark as cooked or remove from shelf"
                >
                  <Trash2 size={14} />
                  <span>Cooked / Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
