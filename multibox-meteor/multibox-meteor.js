if (Meteor.isClient) {

  Template.multibox.rendered = function () {
    function displaySelected(multiboxSelector) {
  var vals = $(multiboxSelector).multibox('getSelectedValues');
  var display = '';
  for (var i = 0; i < vals.length; i++) {
    if (display === '') {
      display = vals[i];
    }
    else {
        display = display + ', ' + vals[i];
    }
  }

  $('#num-selected').val(display);
}

function displaySelectionChanged(multiboxSelector) {
  $('#selection-changed').text('')
              .show()
              .css('color', 'green')
              .text('selection changed')
              .fadeOut({
                duration: 600
              });
}

function getDisplaySelection() {
  if ($('display-selected').hasClass('current-selection')) {
    return 'selected';
  }

  return 'all';
}

function rebuild(multiboxSelector) {
  $(multiboxSelector).multibox('clearOptions');

  var count = 50;
  for (var i = 0; i < count; i++) {
    var subOptionLabel = 'Even';
    if (((i + 1) % 2) === 1) {
      subOptionLabel = 'Odd';
    }

    subOptionLabel += ' Sub Option';

    var multiboxOptionObject = {
      value: i,
      groups: [subOptionLabel],
      mainLabel: 'Main Label ' + (i + 1),
      subLabel: subOptionLabel,
      showBadge: true,
      badgeLabel: i + 1,
      showCheck: true
    };

    var multiboxOption = $(multiboxSelector).multibox('buildMultiboxOption', multiboxOptionObject);
    $(multiboxSelector).multibox('appendOption', multiboxOption);
  }

  $(multiboxSelector).multibox('initChecks');
  $(multiboxSelector).multibox('centerVerticallyBadges');
  $(multiboxSelector).multibox('enableHover');

  $('#display-all').addClass('current-selection');
  $('#display-selected').removeClass('current-selection');

  $('#selection-mode-multiple').addClass('current-selection');
  $('#selection-mode-single').removeClass('current-selection');
}

function rebuildControlPanel(multiboxSelector) {
  $(multiboxSelector).multibox('clearOptions');

  var multiboxControlObjectAll = {
    value: 'all',
    buttonValue: 'Show All'
  };
  var multiboxControlObjectSelected = {
    value: 'selected',
    buttonValue: 'Show Selected'
  };

  var multiboxControlAll = $(multiboxSelector).multibox('buildMultiboxControl', multiboxControlObjectAll);
  var multiboxControlSelected = $(multiboxSelector).multibox('buildMultiboxControl', multiboxControlObjectSelected);
  $(multiboxSelector).multibox('appendOption', multiboxControlAll);
  $(multiboxSelector).multibox('appendOption', multiboxControlSelected);
}

$(document).ready(function () {
  $('#multibox').multibox({
      appendTo: "body",
    autoRefresh: true,
      filter: "div.multibox-option",
    allowSelection: true,
    allowDragSelection: true,
    showSelectionHelper: false,

    displayFilter: "all",
    selectionMode: "multiple",
      
      start: function (event, ui) {
      },
      selected: function (event, ui) {
      },
      unselected: function (event, ui) {
      },
      stop: function (event, ui) {
      },
      change: function (event, ui) {
        displaySelectionChanged('#multibox');
        displaySelected('#multibox');
      }
    });

  $('#multibox-control-panel').multibox({
      appendTo: "body",
    autoRefresh: true,
      filter: "div.multibox-option.multibox-control",
    allowSelection: true,
    allowDragSelection: false,
    showSelectionHelper: false,

    displayFilter: "all",
    selectionMode: "single",
      
      start: function (event, ui) {
      },
      selected: function (event, ui) {
      },
      unselected: function (event, ui) {
      },
      stop: function (event, ui) {
      },
      change: function (event, ui) {
      }
    });

  $('#rebuild').bind('click', function () {
    rebuild('#multibox');
  });
  $('#clear').bind('click', function () {
    $('#multibox').multibox('clearOptions');
  });
  $('#select-all').bind('click', function () {
    $('#multibox').multibox('selectAll');
  });
  $('#clear-selection').bind('click', function () {
    $('#multibox').multibox('clearSelection');
  });
  $('#select-odd').bind('click', function () {
    $('#multibox').multibox('selectGroup', 'Odd Sub Option');
  });
  $('#select-even').bind('click', function () {
    $('#multibox').multibox('selectGroup', 'Even Sub Option');
  });
  $('#search').keyup(function () {
    $('#multibox').multibox('search', $(this).val());
  });

  $('#display-all').bind('click', function () {
    $('#display-selected').removeClass('current-selection');
    $('#display-all').addClass('current-selection');
    
    $('#multibox').multibox('showAll');
  });
  $('#display-selected').bind('click', function () {
    $('#display-all').removeClass('current-selection');
    $('#display-selected').addClass('current-selection');

    $('#multibox').multibox('showSelected');
  });

  $('#selection-mode-single').bind('click', function () {
    $('#selection-mode-multiple').removeClass('current-selection');
    $('#selection-mode-single').addClass('current-selection');

    $('#multibox').multibox('option', 'selectionMode', 'single');
  });
  $('#selection-mode-multiple').bind('click', function () {
    $('#selection-mode-single').removeClass('current-selection');
    $('#selection-mode-multiple').addClass('current-selection');

    $('#multibox').multibox('option', 'selectionMode', 'multiple');
  });
  
  rebuild('#multibox');
  rebuildControlPanel('#multibox-control-panel');
});
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

