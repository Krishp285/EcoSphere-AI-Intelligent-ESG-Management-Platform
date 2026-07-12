import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calculator, Leaf, Fuel, Zap, Trees } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import { useEsg } from '../../context/EsgContext';

const DEPARTMENTS = ['Manufacturing', 'Logistics', 'IT', 'HR', 'Finance', 'Operations'];
const SOURCES = ['Electricity', 'Fuel', 'Waste', 'Transport', 'Manufacturing', 'Water'];
const ACTIVITY_TYPES = {
  Electricity: ['Grid Power Consumption', 'Solar Generation', 'Data Center Cooling', 'HVAC'],
  Fuel: ['Fleet Operations', 'Generator Backup', 'Heating', 'Industrial Process'],
  Waste: ['Solid Waste Disposal', 'Hazardous Waste', 'Recycling', 'Composting'],
  Transport: ['Air Travel', 'Road Freight', 'Sea Freight', 'Rail'],
  Manufacturing: ['Steel Production', 'Chemical Processing', 'Assembly', 'Packaging'],
  Water: ['Water Treatment', 'Irrigation', 'Cooling Towers', 'Wastewater'],
};
const UNITS = { Electricity: ['kWh', 'MWh'], Fuel: ['Liters', 'Gallons', 'kg'], Waste: ['kg', 'tonnes'], Transport: ['km', 'miles'], Manufacturing: ['kg', 'tonnes'], Water: ['liters', 'm³'] };
const EMISSION_FACTOR_MAP = {
  'Grid Power Consumption': 0.0004, 'Data Center Cooling': 0.0004, 'HVAC': 0.0004, 'Solar Generation': 0.00001,
  'Fleet Operations': 0.00268, 'Generator Backup': 0.00268, 'Heating': 0.00202, 'Industrial Process': 0.00185,
  'Solid Waste Disposal': 0.00082, 'Hazardous Waste': 0.0012, 'Recycling': 0.00015, 'Composting': 0.00025,
  'Air Travel': 0.000255, 'Road Freight': 0.000096, 'Sea Freight': 0.000011, 'Rail': 0.000041,
  'Steel Production': 0.00185, 'Chemical Processing': 0.00220, 'Assembly': 0.00060, 'Packaging': 0.00070,
  'Water Treatment': 0.000295, 'Irrigation': 0.000295, 'Cooling Towers': 0.000295, 'Wastewater': 0.000680,
};

const ResultCard = ({ icon: Icon, label, value, color }) => (
  <div className={`p-4 rounded-xl border ${color} text-center`}>
    <Icon className="w-8 h-8 mx-auto mb-2 opacity-70" />
    <p className="text-xs text-gray-600 mb-1">{label}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

const CarbonCalculator = () => {
  const { emissionFactors, addTransaction } = useEsg();
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const [selectedSource, setSelectedSource] = useState('Electricity');
  const [selectedActivity, setSelectedActivity] = useState('');

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: { department: 'Manufacturing', source: 'Electricity', quantity: '', unit: 'kWh', date: new Date().toISOString().split('T')[0], location: '', description: '' }
  });

  const watchSource = watch('source');
  const watchActivity = watch('activity_type');
  const watchQuantity = watch('quantity');

  const calcCO2 = (qty, factor) => parseFloat((qty * factor).toFixed(4));

  const onCalculate = (data) => {
    const factor = EMISSION_FACTOR_MAP[data.activity_type] || parseFloat(data.emission_factor) || 0.0004;
    const qty = parseFloat(data.quantity) || 0;
    const co2 = calcCO2(qty, factor);
    const trees = Math.round(co2 / 0.021);     // avg tree absorbs 21kg/yr
    const fuel = (co2 / 0.00268).toFixed(0);   // liters of diesel equiv
    const electricity = (co2 / 0.0004).toFixed(0); // kWh equiv
    setResult({ ...data, total_co2: co2, trees, fuel, electricity, emission_factor: factor });
    setSaved(false);
  };

  const onSaveTransaction = () => {
    if (!result) return;
    addTransaction({
      department: result.department,
      source: result.source,
      activity_type: result.activity_type,
      quantity: parseFloat(result.quantity),
      unit: result.unit,
      emission_factor: result.emission_factor,
      total_co2: result.total_co2,
      date: result.date,
      location: result.location,
      description: result.description,
    });
    setSaved(true);
  };

  const handleSourceChange = (e) => {
    const src = e.target.value;
    setValue('source', src);
    setSelectedSource(src);
    setValue('activity_type', '');
    setValue('unit', (UNITS[src] || ['unit'])[0]);
    setSelectedActivity('');
  };

  const handleActivityChange = (e) => {
    const act = e.target.value;
    setValue('activity_type', act);
    setSelectedActivity(act);
    const factor = EMISSION_FACTOR_MAP[act];
    if (factor) setValue('emission_factor', factor);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form */}
      <Card className="lg:col-span-2">
        <CardHeader title="Carbon Footprint Calculator" subtitle="Enter activity details to calculate carbon emissions" />
        <CardContent>
          <form onSubmit={handleSubmit(onCalculate)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select className="block w-full rounded-md border-gray-300 border py-2 px-3 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none"
                  {...register('department', { required: 'Required' })}>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              {/* Emission Source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emission Source</label>
                <select className="block w-full rounded-md border-gray-300 border py-2 px-3 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none"
                  {...register('source')}
                  onChange={handleSourceChange}>
                  {SOURCES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Activity Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
                <select className="block w-full rounded-md border-gray-300 border py-2 px-3 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none"
                  {...register('activity_type', { required: 'Required' })}
                  onChange={handleActivityChange}>
                  <option value="">-- Select Activity --</option>
                  {(ACTIVITY_TYPES[watchSource] || []).map(a => <option key={a}>{a}</option>)}
                </select>
                {errors.activity_type && <p className="text-xs text-red-500 mt-1">{errors.activity_type.message}</p>}
              </div>

              {/* Emission Factor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emission Factor (tCO₂/unit)</label>
                <Input type="number" step="0.000001" placeholder="0.0004"
                  {...register('emission_factor', { required: 'Required', min: 0 })}
                  error={errors.emission_factor?.message}
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <Input type="number" step="0.01" placeholder="e.g. 5000"
                  {...register('quantity', { required: 'Required', min: { value: 0.01, message: 'Must be > 0' } })}
                  error={errors.quantity?.message}
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <select className="block w-full rounded-md border-gray-300 border py-2 px-3 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none"
                  {...register('unit')}>
                  {(UNITS[watchSource] || ['unit']).map(u => <option key={u}>{u}</option>)}
                </select>
              </div>

              {/* Date */}
              <Input label="Date" type="date" {...register('date', { required: 'Required' })} error={errors.date?.message} />

              {/* Location */}
              <Input label="Location" type="text" placeholder="e.g. Plant A, Chennai" {...register('location')} />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea rows={2} placeholder="Optional description..."
                className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none"
                {...register('description')}
              />
            </div>

            <Button type="submit" icon={Calculator} className="w-full md:w-auto">Calculate Carbon</Button>
          </form>
        </CardContent>
      </Card>

      {/* Results Panel */}
      <div className="space-y-4">
        <Card>
          <CardHeader title="Calculation Results" />
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="text-center p-4 bg-primary-50 rounded-xl border border-primary-100">
                  <p className="text-xs text-gray-500 mb-1">Total CO₂ Emitted</p>
                  <p className="text-4xl font-extrabold text-primary-700">{result.total_co2}</p>
                  <p className="text-sm text-gray-500">metric tons CO₂e</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <ResultCard icon={Trees} label="Equivalent Trees to Offset" value={`${result.trees} trees/year`} color="border-green-200 text-green-700" />
                  <ResultCard icon={Fuel} label="Equivalent Diesel Fuel" value={`${result.fuel} liters`} color="border-yellow-200 text-yellow-700" />
                  <ResultCard icon={Zap} label="Equivalent Electricity" value={`${result.electricity} kWh`} color="border-blue-200 text-blue-700" />
                </div>

                {saved ? (
                  <Badge variant="success" className="w-full justify-center py-2 text-sm">✓ Saved as Carbon Transaction</Badge>
                ) : (
                  <Button onClick={onSaveTransaction} icon={Leaf} fullWidth>Save as Transaction</Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Calculator className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Fill in the form and click<br /><strong>Calculate Carbon</strong></p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emission Factors Reference */}
        <Card>
          <CardHeader title="Emission Factors Reference" subtitle="Commonly used factors" />
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {emissionFactors.slice(0, 5).map(ef => (
                <div key={ef.id} className="flex justify-between text-xs border-b border-gray-50 pb-1">
                  <span className="text-gray-700">{ef.name}</span>
                  <span className="font-mono text-primary-700">{ef.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CarbonCalculator;
