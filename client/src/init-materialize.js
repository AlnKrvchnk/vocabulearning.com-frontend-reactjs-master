import M from 'materialize-css'


document.addEventListener('DOMContentLoaded', function() {
    let elems = document.querySelectorAll('select');
    let instances = M.FormSelect.init(elems);

    M.Sidenav.init(document.querySelectorAll('.sidenav'))

    M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'))
});

String.prototype.splice = function (i, j, str) {
    return this.substr(0, i) + str + this.substr(j, this.length);
};