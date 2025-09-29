import React from 'react'

function Invoice() {
  const invoiceData = [
    {
      id: 1,
      name: "James Anderson",
      amount: "$320",
      avatar: "/avatars/james.jpg",
      highlighted: false
    },
    {
      id: 2,
      name: "Michael Johnson", 
      amount: "$210",
      avatar: "/avatars/michael.jpg",
      highlighted: false
    },
    {
      id: 3,
      name: "David Brown",
      amount: "$315",
      avatar: "/avatars/david.jpg", 
      highlighted: false
    },
    {
      id: 4,
      name: "Orlando Diggs",
      amount: "$250",
      avatar: "/avatars/orlando.jpg",
      highlighted: false
    }
  ];

  return (
    <div className='bg-white px-6 py-6 rounded-lg shadow-sm flex flex-col gap-6 min-w-[400px]'>
      <div className="font-bold text-2xl text-gray-800">
        Latest Invoice
      </div>
      <div className="w-full h-px bg-gray-200"></div>
      
      <div className="flex justify-between items-center text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
        <span>NAME</span>
        <span>AMOUNT</span>
      </div>

      <div className="space-y-4">
        {invoiceData.map((invoice, index) => (
          <div 
            key={invoice.id}
            className={`flex items-center justify-between p-4 rounded-lg transition-all ${
              invoice.highlighted 
                ? 'border-2 border-blue-500 bg-blue-50' 
                : index % 2 === 1 
                  ? 'border border-gray-100 bg-gray-100 hover:bg-gray-100'
                  : 'border border-gray-100 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                  {invoice.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <span className="font-medium text-gray-800">{invoice.name}</span>
            </div>
            <span className="font-semibold text-gray-800">{invoice.amount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Invoice