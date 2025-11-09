// js/dashboard.js
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadDashboardData();
    setCurrentDate();
});

function setCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('sw-TZ', options);
}

async function loadDashboardData() {
    try {
        // Load members count
        const { data: members, error: membersError } = await supabase
            .from('profiles')
            .select('*');
            
        if (!membersError) {
            document.getElementById('totalMembers').textContent = members.length;
        }
        
        // Load upcoming events
        const { data: events, error: eventsError } = await supabase
            .from('events')
            .select('*')
            .gte('event_date', new Date().toISOString().split('T')[0])
            .order('event_date', { ascending: true });
            
        if (!eventsError) {
            document.getElementById('totalEvents').textContent = events.length;
        }
        
        // Load total contributions
        const { data: contributions, error: contributionsError } = await supabase
            .from('contributions')
            .select('amount');
            
        if (!contributionsError) {
            const total = contributions.reduce((sum, item) => sum + parseFloat(item.amount), 0);
            document.getElementById('totalContributions').textContent = total.toLocaleString();
        }
        
        // Load active services
        const { data: services, error: servicesError } = await supabase
            .from('member_services')
            .select('*')
            .eq('status', 'active');
            
        if (!servicesError) {
            document.getElementById('activeServices').textContent = services.length;
        }
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}
