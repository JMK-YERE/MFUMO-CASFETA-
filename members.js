// js/members.js
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadMembers();
    
    // Add member form
    document.getElementById('addMemberForm').addEventListener('submit', addMember);
    
    // Search functionality
    document.getElementById('searchMembers').addEventListener('input', searchMembers);
});

async function loadMembers() {
    try {
        const { data: members, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        
        displayMembers(members);
        
    } catch (error) {
        console.error('Error loading members:', error);
        alert('Error loading members: ' + error.message);
    }
}

function displayMembers(members) {
    const tbody = document.getElementById('membersTable');
    const countElement = document.getElementById('membersCount');
    
    countElement.textContent = members.length;
    
    if (members.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">Hakuna wanachama waliosajiliwa bado</td></tr>';
        return;
    }
    
    tbody.innerHTML = members.map(member => `
        <tr>
            <td>${member.full_name || '-'}</td>
            <td>${member.email || '-'}</td>
            <td>${member.phone || '-'}</td>
            <td>${member.department || '-'}</td>
            <td>
                <span class="role-badge" style="
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    background: ${getRoleColor(member.role)};
                    color: white;
                ">${getRoleName(member.role)}</span>
            </td>
            <td>
                <button onclick="editMember('${member.id}')" class="btn btn-primary" style="padding: 5px 10px; font-size: 0.8rem;">🖊️ Hariri</button>
                <button onclick="deleteMember('${member.id}')" class="btn btn-danger" style="padding: 5px 10px; font-size: 0.8rem;">🗑️ Futa</button>
            </td>
        </tr>
    `).join('');
}

function getRoleColor(role) {
    const colors = {
        'mwenyekiti': '#e74c3c',
        'katibu': '#3498db',
        'mhazina': '#27ae60',
        'mwanachama': '#95a5a6',
        'bakada': '#9b59b6',
        'makada': '#e67e22',
        'mwendeshaji': '#f39c12',
        'it_support': '#1abc9c'
    };
    return colors[role] || '#95a5a6';
}

function getRoleName(role) {
    const names = {
        'mwenyekiti': 'Mwenyekiti',
        'katibu': 'Katibu',
        'mhazina': 'Mhazina',
        'mwanachama': 'Mwanachama',
        'bakada': 'Bakada',
        'makada': 'Makada',
        'mwendeshaji': 'Mwendeshaji',
        'it_support': 'IT Support'
    };
    return names[role] || role;
}

async function addMember(e) {
    e.preventDefault();
    
    const memberData = {
        full_name: document.getElementById('fullName').value,
        email: document.getElementById('memberEmail').value,
        phone: document.getElementById('memberPhone').value,
        department: document.getElementById('memberDepartment').value,
        year_of_study: document.getElementById('memberYear').value,
        role: document.getElementById('memberRole').value,
        member_status: 'active'
    };
    
    try {
        // First create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: memberData.email,
            password: 'casfeta2024', // Default password
            options: {
                data: {
                    full_name: memberData.full_name,
                    role: memberData.role
                }
            }
        });
        
        if (authError) throw authError;
        
        // Then add to profiles table
        const { data, error } = await supabase
            .from('profiles')
            .insert([memberData]);
            
        if (error) throw error;
        
        alert('✅ Mwanachama amesajiliwa kikamilifu!');
        document.getElementById('addMemberForm').reset();
        loadMembers();
        
    } catch (error) {
        console.error('Error adding member:', error);
        alert('Error adding member: ' + error.message);
    }
}

function searchMembers() {
    const searchTerm = document.getElementById('searchMembers').value.toLowerCase();
    const rows = document.getElementById('membersTable').getElementsByTagName('tr');
    
    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    }
}

async function deleteMember(memberId) {
    if (!confirm('Je, una uhakika unataka kumfuta mwanachama huyu?')) return;
    
    try {
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', memberId);
            
        if (error) throw error;
        
        alert('✅ Mwanachama amefutwa kikamilifu!');
        loadMembers();
        
    } catch (error) {
        console.error('Error deleting member:', error);
        alert('Error deleting member: ' + error.message);
    }
}

function editMember(memberId) {
    alert('📝 Hariri utafutwa baadaye... Mwanachama ID: ' + memberId);
}
