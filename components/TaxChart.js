import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

export default function TaxChart() {
  const data = [
    { name: 'Karachi', value: 38, color: '#10B981' },
    { name: 'Lahore', value: 24, color: '#3B82F6' },
    { name: 'Islamabad', value: 15, color: '#F59E0B' },
    { name: 'Rawalpindi', value: 8, color: '#EF4444' },
    { name: 'Faisalabad', value: 6, color: '#8B5CF6' },
    { name: 'Others', value: 9, color: '#6B7280' }
  ]

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280']

  return (
    <div className="w-full h-96 animate-fadeIn">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
