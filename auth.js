// KIOLEZO: Mfumo wa kumwongoza mtumiaji kwenye dashboard yake (auth.js)
const userDashboards = {
    'mwenyekiti': 'pages/dashboard-mwenyekiti.html',
    'katibu': 'pages/dashboard-katibu.html',
    'mhazina': 'pages/dashboard-mhazina.html',
    'mwanachama': 'pages/dashboard-mwanachama.html',
    'bakada': 'pages/dashboard-bakada.html',
    'makada': 'pages/dashboard-makada.html',
    'it_support': 'pages/dashboard-it.html'
};

// Baada ya mtu kuingia kikamilifu, mpeleke kwenye dashboard yake
function redirectUser(userRole) {
    const dashboardUrl = userDashboards[userRole];
    if (dashboardUrl) {
        window.location.href = dashboardUrl;
    } else {
        // Iwapo cheo hakijatambulika, mpeleke kwenye dashboard ya msingi
        window.location.href = 'pages/dashboard-mwanachama.html';
    }
}
