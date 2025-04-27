const navigateTo = url => {
  history.pushState(null, null, url);
  router();
};

const router = async () => {
  const routes = [
    { path: '/', view: () => console.log('Viewing Dashboard') },
    { path: "/timer", view : () => console.log("Viewing timer") },
        { path : "/register-runner", view : () => console.log("Viewing runner registration") },
    ];

    //test each route for potential match
    const potentialMatches = routes.map(route  => {
        return {
            route : route,
            isMatch: location.pathname === route.path
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

    if (!match)  {
        match = {
            route : routes[0],
            isMatch: true
        };
    }
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    router();
});