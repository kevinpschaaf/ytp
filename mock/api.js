(function() {

  let dummy;
  function fetchDummy() {
    if (dummy) {
      return Promise.resolve(dummy);
    } else {
      return new Promise(resolve => {
        fetch('mock/dummy.json')
          .then(resp => resp.json())
          .then(json => resolve(dummy=json));
      });
    }
  }

  let authListeners = [];
  let signedIn = true;

  window.gapi = {
    load(x, cb) {
      Promise.resolve().then(cb);
    },
    client: {
      init() {
        return Promise.resolve();
      },
      request(req) {
        return {
          execute(cb) {
            switch(req.path) {
              case '/youtube/v3/videos':
                if (req.params.myRating == 'like') {
                  fetchDummy().then(state => cb({items: state.likedVideos.items.map(id => state.videos[id])}));
                } else if (req.params.chart == 'mostPopular') {
                  fetchDummy().then(state => cb({items: state.trendingVideos.items.map(id => state.videos[id])}));
                }
                break;
              case '/youtube/v3/videos/getRating':
                if (req.method == 'POST') {
                  Promise.resolve().then(cb);
                } else {
                  fetchDummy().then(state => cb({items: [{rating: state.videos[req.params.id].rating}]}));
                }
                break;
            }
          }
        }
      },
      youtube: {
        channels: {
          list(params) {
            return {
              execute(cb) {
                if (params.mine) {
                  fetchDummy().then(state => cb({items: [{snippet: state.user}]}));
                }
              }
            }
          }
        }
      }
    },
    auth2: {
      getAuthInstance() {
        return {
          isSignedIn: {
            get() { return signedIn; },
            listen(cb) { authListeners.push(cb); }
          },
          signOut() {
            signedIn = false;
            Promise.resolve().then(_=>authListeners.forEach(cb => cb(signedIn)));
          },
          signIn() {
            signedIn = true;
            Promise.resolve().then(_=>authListeners.forEach(cb => cb(signedIn)));
          }
        }
      }
    }
  }

})();