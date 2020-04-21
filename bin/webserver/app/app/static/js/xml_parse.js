/**********************/
/* This scripts retrieves an XML file and populates the editor form
/**********************/

/************************************************/
/*****               FUNCTIONS             ******/
/************************************************/

function fill_form(data) {

    // ******** Cast data to JQuery and get ESMDefinition ********

    $data = $(data).children();

    // ******** Questionnaire settings ********

    $('#name').val($data.find('name').text());
    $('#short_name').val($data.find('short_name').text());
    $('#description').val($data.find('description').text());

    // ******** Questions ********

    $questions = $data.find('Question');
    for (i = 0; i < $questions.length; i++) { addComponent(); }
    $questions.each(function(i) {
        // Add question
        $q = $(this);
        $block = $('.questionBlock').eq(i);

        // Change ESM type
        esm_type = $q.find('ESM_Type').text();
        select = $block.find('select[name="questionType"]');
        select.val(esm_type);
        questionTypeChange(select[0]);

        // Question general settings
        $block.find('.questionTitle').val($q.find('Title').text());
        $block.find('.questionInstructions').val($q.find('Instructions').text());
        $block.find('.questionLocale').val($q.find('Locale').text());
        $block.find('.questionSubmitText').val($q.find('SubmitText').text());
        $block.find('.questionCancelText').val($q.find('CancelText').text());
        $block.find('.questionExpiration').val($q.find('ExpirationThreshold').text());
        $block.find('.questionTimeout').val($q.find('NotificationTimeout').text());

        // Question type settings
        switch(esm_type) {
            case "ESM_FreeText":
                break;
            case "ESM_Likert":
                $block.find('.likertMax').val($q.find('LikertMax').text());
                $block.find('.likertStep').val($q.find('LikertStep').text());
                $block.find('.likertMinLabel').val($q.find('LikertMinLabel').text());
                $block.find('.likertMaxLabel').val($q.find('LikertMaxLabel').text());
                break;
            case "ESM_QuickAnswer":
                $block.find('.quickAnswers').val($q.find('Option').map( function() { return $(this).text() } ).toArray().join());
                break;
            case "ESM_Scale":
                $block.find('.scaleMin').val($q.find('ScaleMin').text());
                $block.find('.scaleMax').val($q.find('ScaleMax').text());
                $block.find('.scaleStep').val($q.find('ScaleStep').text());
                $block.find('.scaleStart').val($q.find('ScaleStart').text());
                $block.find('.scaleMinLabel').val($q.find('ScaleMinLabel').text());
                $block.find('.scaleMaxLabel').val($q.find('ScaleMaxLabel').text());
                break;
            case "ESM_ScaleImage":
                if ($q.find('ScaleStartRandom').length > 0) {
                    radio = $block.find('input[name^="scaleStartType"][value="random"]');
                    radio.prop('checked', true);
                    startTypeChange(radio[0]);
                    if ($q.find('ScaleStartRandomValues').length > 0) {
                        radio = $block.find('input[name^="scaleStartRandomType"][value="interval"]');
                        radio.prop('checked', true);
                        randomStartTypeChange(radio[0]);
                        $block.find('input[name^="scaleStartRandomInterval"]').val($q.find('ScaleStartRandomValues').text());
                    }
                } else {
                    $block.find('.scaleStartFixed').val($q.find('ScaleStart').text());
                }
                $block.find('.scaleMin').val($q.find('ScaleMin').text());
                $block.find('.scaleMax').val($q.find('ScaleMax').text());
                $block.find('.scaleStep').val($q.find('ScaleStep').text());
                $block.find('.scaleMinLabel').val($q.find('ScaleMinLabel').text());
                $block.find('.scaleMaxLabel').val($q.find('ScaleMaxLabel').text());
                $block.find('.scaleURLleft').val($q.find('LeftImageUrl').text());
                $block.find('.scaleURLright').val($q.find('RightImageUrl').text());
                if ($q.find('ScaleValueVisible').length > 0) {
                    $block.find('input[name^="scaleValueVisible"]').prop('checked', 'true');
                }
                break;
            default:
                break;
        }
    });

    // ******** Schedules ********

    $schedules = $data.find('Schedule');
    for (i = 0; i < $schedules.length; i++) { addSchedule(); }
    $schedules.each(function(i) {
        // Add schedule
        $s = $(this);
        $block = $('.scheduleBlock').eq(i);

        // Schedule name
        $block.find('.scheduleName').val($s.find('id').text());

        // Random schedule
        if ($s.find('random').length > 0) {
            radio = $block.find('input[name^="scheduleType"][value="random"]');
            radio.prop('checked', true);
            scheduleTypeChange(radio[0]);
            $block.find('.scheduleRandomHours').val($s.find('hour').map( function() { return $(this).text() } ).toArray().join());
            $block.find('.scheduleRandomAmount').val($s.find('amount').text());
            $block.find('.scheduleRandomInterval').val($s.find('interval').text());
        // Fixed schedule
        } else {
            $block.find('.scheduleFixedHours').val($s.find('hour').map( function() { return $(this).text() } ).toArray().join());
            $block.find('.scheduleFixedMinutes').val($s.find('minute').map( function() { return $(this).text() } ).toArray().join());
            $block.find('.scheduleFixedWeekdays').val($s.find('weekday').map( function() { return $(this).text() } ).toArray().join());
            $block.find('.scheduleFixedMonths').val($s.find('month').map( function() { return $(this).text() } ).toArray().join());
        }
    });
    
}

/*******************************************/
/*****               MAIN             ******/
/*******************************************/

$(document).ready(function(){
    url = $('script').last().attr('url');

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        fill_form(this.responseXML);
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
});

