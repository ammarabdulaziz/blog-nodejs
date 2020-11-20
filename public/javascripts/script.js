$(document).ready(function () {
  $('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
  });
});

$(document).ready(function () {
  $('#blog-table').DataTable({
    "order": [[ 0, "desc" ]]
  });
});

$(document).ready(function () {
    $("#view").removeClass("sorting");
    $("#edit").removeClass("sorting");
    $("#delete").removeClass("sorting");
});