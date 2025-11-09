// js/finances.js
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadContributions();
    loadMembersForDropdown();
    loadFinancialSummary();
    
    document.getElementById('addContributionForm').addEventListener('submit', addContribution);
});

async function loadFinancialSummary() {
    try {
        // Total contributions
        const { data: contributions, error } = await supabase
            .from('contributions')
            .select('amount, payment_date, status');
            
        if (error) throw error;
        
        const total = contributions.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        document.getElementById('totalContributionsSum').textContent = total.toLocaleString();
        
        // This month contributions
        const now = new Date();
        const thisMonth = contributions.filter(item => {
            const paymentDate = new Date(item.payment_date);
            return paymentDate.getMonth() === now.getMonth() && 
                   paymentDate.getFullYear() === now.getFullYear();
        });
        
        const monthTotal = thisMonth.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        document.getElementById('thisMonthContributions').textContent = monthTotal.toLocaleString();
        
        // Unique members who paid this month
        const uniqueMembers = [...new Set(thisMonth.map(item => item.member_id))];
        document.getElementById('totalMembersPaid').textContent = uniqueMembers.length;
        
        // Pending payments
        const pending = contributions.filter(item => item.status === 'pending').length;
        document.getElementById('pendingPayments').textContent = pending;
        
    } catch (error) {
        console.error('Error loading financial summary:', error);
    }
}

async function loadMembersForDropdown() {
    try {
        const { data: members, error } = await supabase
            .from('profiles')
            .select('id, full_name')
            .order('full_name');
            
        if (error) throw error;
        
        const dropdown = document.getElementById('contributor');
        dropdown.innerHTML = '<option value="">--Chagua Mwanachama--</option>' +
            members.map(member => 
                `<option value="${member.id}">${member.full_name}</option>`
            ).join('');
            
    } catch (error) {
        console.error('Error loading members for dropdown:', error);
    }
}

async function loadContributions() {
    try {
        const { data: contributions, error } = await supabase
            .from('contributions')
            .select(`
                *,
                profiles:member_id (full_name)
            `)
            .order('payment_date', { ascending: false });
            
        if (error) throw error;
        
        displayContributions(contributions);
        
    } catch (error) {
        console.error('Error loading contributions:', error);
        alert('Error loading contributions: ' + error.message);
    }
}

function displayContributions(contributions) {
    const tbody = document.getElementById('contributionsTable');
    const countElement = document.getElementById('contributionsCount');
    
    countElement.textContent = contributions.length;
    
    if (contributions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">Hakuna michango iliyorekodiwa bado</td></tr>';
        return;
    }
    
    tbody.innerHTML = contributions.map(contribution => {
        const memberName = contribution.profiles ? contribution.profiles.full_name : 'Unknown';
        
        return `
            <tr>
                <td>${memberName}</td>
                <td style="font-weight: bold; color: #27ae60;">${parseFloat(contribution.amount).toLocaleString()} TZS</td>
                <td>
                    <span style="
                        padding: 4px 8px;
                        border-radius: 12px;
                        font-size: 0.8rem;
                        background: ${getContributionTypeColor(contribution.contribution_type)};
                        color: white;
                    ">${getContributionTypeName(contribution.contribution_type)}</span>
                </td>
                <td>${getPaymentMethodName(contribution.payment_method)}</td>
                <td>${formatDate(contribution.payment_date)}</td>
                <td>${contribution.purpose || '-'}</td>
                <td>
                    <button onclick="editContribution('${contribution.id}')" class="btn btn-primary" style="padding: 5px 10px; font-size: 0.8rem;">🖊️ Hariri</button>
                </td>
            </tr>
        `;
    }).join('');
}

function getContributionTypeColor(type) {
    const colors = {
        'mchango': '#3498db',
        'sadaka': '#27ae60',
        'kujenga': '#e67e22',
        'misheni': '#9b59b6',
        'matukio': '#e74c3c'
    };
    return colors[type] || '#95a5a6';
}

function getContributionTypeName(type) {
    const names = {
        'mchango': 'Mchango',
        'sadaka': 'Sadaka',
        'kujenga': 'Kujenga',
        'misheni': 'Misheni',
        'matukio': 'Matukio'
    };
    return names[type] || type;
}

function getPaymentMethodName(method) {
    const names = {
        'mpesa': 'M-Pesa',
        'cash': 'Fedha Taslimu',
        'airtel_money': 'Airtel Money',
        'tigo_pesa': 'Tigo Pesa',
        'bank': 'Benki'
    };
    return names[method] || method;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('sw-TZ', options);
}

async function addContribution(e) {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('casfeta_user'));
    
    const contributionData = {
        member_id: document.getElementById('contributor').value,
        amount: document.getElementById('amount').value,
        contribution_type: document.getElementById('contributionType').value,
        payment_method: document.getElementById('paymentMethod').value,
        purpose: document.getElementById('purpose').value,
        status: 'paid'
    };
    
    try {
        const { data, error } = await supabase
            .from('contributions')
            .insert([contributionData]);
            
        if (error) throw error;
        
        alert('✅ Mchango umerekodiwa kikamilifu!');
        document.getElementById('addContributionForm').reset();
        loadContributions();
        loadFinancialSummary();
        
    } catch (error) {
        console.error('Error adding contribution:', error);
        alert('Error adding contribution: ' + error.message);
    }
}

function editContribution(contributionId) {
    alert('📝 Hariri mchango utafutwa baadaye... ID: ' + contributionId);
}

function exportContributions() {
    alert('📊 Kutoa ripoti kwa Excel utafutwa baadaye...');
}
