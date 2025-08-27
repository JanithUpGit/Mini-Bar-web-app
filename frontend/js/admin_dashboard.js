document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.sidebar nav a');
    const sections = document.querySelectorAll('.dashboard-section');

    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            showSection(sectionId);

            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Dummy Data - ඔබට මෙය සැබෑ API calls සමඟ ප්‍රතිස්ථාපනය කළ හැක.
    const stockData = [
        { item: 'Whiskey', quantity: 50, price: 5000, status: 'In Stock' },
        { item: 'Vodka', quantity: 30, price: 3500, status: 'Low Stock' },
        { item: 'Beer', quantity: 200, price: 450, status: 'In Stock' }
    ];

    const userData = [
        { id: 'USR001', name: 'John Doe', email: 'john.d@example.com', joined: '2025-07-01' },
        { id: 'USR002', name: 'Jane Smith', email: 'jane.s@example.com', joined: '2025-07-05' }
    ];

    const orderData = [
        { id: 'ORD001', customer: 'Customer A', status: 'Pending', total: '$120.00' },
        { id: 'ORD002', customer: 'Customer B', status: 'Completed', total: '$85.50' }
    ];

    function populateTable(data, tableId) {
        const tableBody = document.getElementById(tableId);
        tableBody.innerHTML = '';
        data.forEach(item => {
            const row = document.createElement('tr');
            for (const key in item) {
                const cell = document.createElement('td');
                cell.textContent = item[key];
                row.appendChild(cell);
            }
            tableBody.appendChild(row);
        });
    }

    populateTable(stockData, 'stock-data-table');
    populateTable(userData, 'user-data-table');
    populateTable(orderData, 'order-data-table');
});