import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Flag, Calendar, Building2 } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Progress from '../../components/common/Progress';
import Modal from '../../components/common/Modal';
import { useEsg } from '../../context/EsgContext';
import { useForm } from 'react-hook-form';

const DEPARTMENTS = ['All', 'Manufacturing', 'Logistics', 'IT', 'HR', 'Finance', 'Operations'];

const STATUS_CONFIG = {
  'Achieved': { variant: 'success', color: 'bg-green-500' },
  'In Progress': { variant: 'primary', color: 'bg-primary-500' },
  'At Risk': { variant: 'danger', color: 'bg-red-500' },
  'Not Started': { variant: 'gray', color: 'bg-gray-400' },
};

const SustainabilityGoals = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useEsg();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const openCreate = () => { setEditingGoal(null); reset({}); setIsModalOpen(true); };
  const openEdit = (g) => {
    setEditingGoal(g);
    reset({ name: g.name, department: g.department, target: g.target, current: g.current, unit: g.unit, deadline: g.deadline, status: g.status, description: g.description });
    setIsModalOpen(true);
  };

  const onSubmit = (data) => {
    const goal = { ...data, target: parseFloat(data.target), current: parseFloat(data.current) };
    editingGoal ? updateGoal(editingGoal.id, goal) : addGoal(goal);
    setIsModalOpen(false);
    reset({});
  };

  const getDaysLeft = (deadline) => {
    const diff = new Date(deadline) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const stats = {
    achieved: goals.filter(g => g.status === 'Achieved').length,
    inProgress: goals.filter(g => g.status === 'In Progress').length,
    atRisk: goals.filter(g => g.status === 'At Risk').length,
    total: goals.length,
  };

  return (
    <div className="space-y-6">
      {/* Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Goals', val: stats.total, color: 'text-gray-700' },
          { label: 'Achieved', val: stats.achieved, color: 'text-green-600' },
          { label: 'In Progress', val: stats.inProgress, color: 'text-blue-600' },
          { label: 'At Risk', val: stats.atRisk, color: 'text-red-600' },
        ].map(s => (
          <Card key={s.label}>
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.val}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Sustainability Goals" action={<Button icon={Plus} onClick={openCreate}>New Goal</Button>} />
        <CardContent>
          <div className="space-y-4">
            {goals.length === 0 && (
              <p className="text-center text-gray-400 py-8">No goals yet. Create your first sustainability goal.</p>
            )}
            {goals.map(goal => {
              const completion = Math.round((goal.current / goal.target) * 100);
              const cfg = STATUS_CONFIG[goal.status] || STATUS_CONFIG['Not Started'];
              const daysLeft = getDaysLeft(goal.deadline);
              return (
                <div key={goal.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 mr-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                        <Badge variant={cfg.variant}>{goal.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(goal)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-primary-600">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(goal.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs text-gray-500 mb-3 flex-wrap">
                    <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{goal.department}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Deadline: {goal.deadline}</span>
                    <span className={daysLeft < 30 ? 'text-red-500 font-medium' : ''}>
                      {daysLeft > 0 ? `${daysLeft} days left` : `${Math.abs(daysLeft)} days overdue`}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <Progress value={goal.current} max={goal.target} color={cfg.color} size="lg" className="flex-1" />
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold text-gray-900">{completion}%</p>
                      <p className="text-xs text-gray-400">{goal.current} / {goal.target} {goal.unit}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); reset({}); }}
        title={editingGoal ? 'Edit Sustainability Goal' : 'New Sustainability Goal'}
        className="sm:max-w-lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setIsModalOpen(false); reset({}); }}>Cancel</Button>
            <Button onClick={handleSubmit(onSubmit)}>{editingGoal ? 'Update' : 'Create'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Goal Name" placeholder="e.g. Net Zero Carbon by 2030"
            {...register('name', { required: 'Required' })} error={errors.name?.message} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm outline-none focus:ring-primary-500"
              {...register('department')}>
              {DEPARTMENTS.filter(d => d !== 'All').map(d => <option key={d}>{d}</option>)}
              <option value="All">All Departments</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input label="Target" type="number" placeholder="100"
              {...register('target', { required: 'Required', min: 0 })} error={errors.target?.message} />
            <Input label="Current" type="number" placeholder="68"
              {...register('current', { required: 'Required', min: 0 })} error={errors.current?.message} />
            <Input label="Unit" placeholder="%" {...register('unit', { required: 'Required' })} error={errors.unit?.message} />
          </div>

          <Input label="Deadline" type="date" {...register('deadline', { required: 'Required' })} error={errors.deadline?.message} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm outline-none focus:ring-primary-500"
              {...register('status')}>
              {Object.keys(STATUS_CONFIG).map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={2} className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm outline-none focus:ring-primary-500"
              placeholder="Brief description of the goal..." {...register('description')} />
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Goal"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => { deleteGoal(deleteId); setDeleteId(null); }}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">Are you sure you want to delete this sustainability goal?</p>
      </Modal>
    </div>
  );
};

export default SustainabilityGoals;
