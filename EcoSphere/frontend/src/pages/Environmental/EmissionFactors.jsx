import React, { useState } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { useEsg } from '../../context/EsgContext';
import { useForm } from 'react-hook-form';

const CATEGORIES = ['All', 'Electricity', 'Fuel', 'Waste', 'Transport', 'Manufacturing', 'Water'];

const EmissionFactors = () => {
  const { emissionFactors, addEmissionFactor, updateEmissionFactor, deleteEmissionFactor } = useEsg();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFactor, setEditingFactor] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const openCreate = () => { setEditingFactor(null); reset({}); setIsModalOpen(true); };
  const openEdit = (ef) => {
    setEditingFactor(ef);
    reset({ name: ef.name, category: ef.category, value: ef.value, unit: ef.unit, source: ef.source });
    setIsModalOpen(true);
  };

  const onSubmit = (data) => {
    if (editingFactor) {
      updateEmissionFactor(editingFactor.id, { ...data, value: parseFloat(data.value) });
    } else {
      addEmissionFactor({ ...data, value: parseFloat(data.value) });
    }
    setIsModalOpen(false);
    reset({});
  };

  const filtered = emissionFactors.filter(ef => {
    const matchSearch = ef.name.toLowerCase().includes(search.toLowerCase()) || ef.source.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || ef.category === catFilter;
    return matchSearch && matchCat;
  });

  const catVariants = { Electricity: 'primary', Fuel: 'warning', Waste: 'danger', Transport: 'success', Manufacturing: 'gray', Water: 'primary' };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title={`Emission Factors (${filtered.length})`}
          action={<Button icon={Plus} onClick={openCreate}>Add Factor</Button>}
        />
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex-1 min-w-[200px]">
              <Input placeholder="Search emission factors..." icon={Search} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-1 flex-wrap">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCatFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${catFilter === cat ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(ef => (
              <div key={ef.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={catVariants[ef.category] || 'gray'}>{ef.category}</Badge>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(ef)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-primary-600">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteId(ef.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{ef.name}</h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary-700">{ef.value}</span>
                  <span className="text-xs text-gray-500">{ef.unit}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Source: {ef.source}</p>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-3 text-center py-8 text-gray-400 text-sm">No emission factors match your search</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); reset({}); }}
        title={editingFactor ? 'Edit Emission Factor' : 'Add Emission Factor'}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setIsModalOpen(false); reset({}); }}>Cancel</Button>
            <Button onClick={handleSubmit(onSubmit)}>{editingFactor ? 'Update' : 'Create'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Factor Name" placeholder="e.g. Grid Electricity (India)"
            {...register('name', { required: 'Required' })} error={errors.name?.message} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none"
              {...register('category', { required: 'Required' })}>
              {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Factor Value" type="number" step="0.000001" placeholder="0.0004"
              {...register('value', { required: 'Required', min: 0 })} error={errors.value?.message} />
            <Input label="Unit" placeholder="tCO₂/kWh"
              {...register('unit', { required: 'Required' })} error={errors.unit?.message} />
          </div>

          <Input label="Data Source" placeholder="e.g. CEA 2023, IPCC 2021"
            {...register('source', { required: 'Required' })} error={errors.source?.message} />
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Emission Factor"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => { deleteEmissionFactor(deleteId); setDeleteId(null); }}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">Are you sure you want to delete this emission factor? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default EmissionFactors;
