/* global angular */

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
angular.module('todomvc', ['ngRoute'])
.config(function ($routeProvider) {
    const routeConfig = {
        controller: 'TodoCtrl',
        templateUrl: 'todomvc-index.html',
        resolve: {
            store: function (todoStorage) {
                // Get the correct module (API or localStorage).
                return todoStorage.then(function (module) {
                    module.get() // Fetch the todo records in the background.
                    return module
                })
            }
        }
    }

    $routeProvider
        .when('/', routeConfig)
        .when('/:status', routeConfig)
        .otherwise({ redirectTo: '/' })
})

// ServiceWorker is a progressive technology. Ignore unsupported browsers
if ('serviceWorker' in navigator) {
    console.log('CLIENT: service worker registration in progress.')
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function () {
        console.log('CLIENT: service worker registration complete.')

        /**
         * show that app is offline
         */
        function showOffline () {
            const offlineNote = document.createElement('p')
            const footer = document.getElementById('info')

            /**
             * wait until footer was rendered by Angular
             */
            if (!footer) {
                return setTimeout(showOffline, 100)
            }

            const newNoteInput = document.querySelector('#new-todo')
            newNoteInput.disabled = 'disabled'

            offlineNote.innerHTML = '(Offline Version)'
            footer.insertBefore(offlineNote, footer.childNodes[0])
        }

        if (!navigator.onLine) {
            showOffline()
        }
    }, function () {
        console.log('CLIENT: service worker registration failure.')
    })
} else {
    console.log('CLIENT: service worker is not supported.')
}
