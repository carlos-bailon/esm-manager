/**********************/
/* This scripts implements the dynamism of the editor form
/**********************/

/************************************************/
/*****             HTML ELEMENTS           ******/
/************************************************/

// ******** Question *****

// Question block
var $questionBlock = $('<div>').attr({'class': 'tab-pane-container questionBlock'}).append(
    $('<div>').attr('class', 'form-group row').append(
        $('<h3>').attr('class', 'col-lg-3 mb-0 question').text('Question '),
        $('<div>').attr('class', 'col-sm-9 d-flex justify-content-between').append(
            $('<div>').append(
                $('<button>').attr({'type': 'button', 'onclick': 'moveUp(this)', 'class': 'btn btn-md btn-editor js-scroll-trigger btn-medium mr-2'}).html('<i class="btn-i fas fa-angle-up"></i>'),
                $('<button>').attr({'type': 'button', 'onclick': 'moveDown(this)', 'class': 'btn btn-md btn-editor js-scroll-trigger btn-medium'}).html('<i class="btn-i fas fa-angle-down"></i>')
            ),
            $('<div>').append(
                $('<select>').attr({'class': 'form-control questionLocale', 'name': 'questionLocale'}).append(
                    $('<option>').attr('value', 'en').text('en'),
                    $('<option>').attr('value', 'es').text('es'),
                    $('<option>').attr('value', 'fr').text('fr')
                )
            ),
            $('<button>').attr({'type': 'button', 'onclick': 'removeBlock(this)', 'class': 'btn btn-md btn-editor js-scroll-trigger btn-red'}).text('Remove question')
        )
    ),
    $('<input>').attr({'name': 'questionNumber', 'type': 'hidden'}),
    $('<div>').attr('class', 'form-group row').append(
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Title*'),
        $('<div>').attr('class', 'col-sm-9').append(
            $('<input>').attr({'class': 'form-control questionTitle', 'name': 'questionTitle', 'type':'text', 'required': ''}),
        )
    ),
    $('<div>').attr('class', 'form-group row').append(
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Instructions'),
        $('<div>').attr('class', 'col-sm-9').append(
            $('<textarea>').attr({'class': 'form-control questionInstructions', 'name': 'questionInstructions', 'rows':'2'}),
        )
    ),
    $('<div>').attr('class', 'form-group row').append(
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Submit label'),
        $('<div>').attr('class', 'col-sm-3').append(
            $('<input>').attr({'class': 'form-control questionSubmitText', 'name': 'questionSubmitText', 'type':'text'}),
        ),
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Cancel label'),
        $('<div>').attr('class', 'col-sm-3').append(
            $('<input>').attr({'class': 'form-control questionCancelText', 'name': 'questionCancelText', 'type':'text'}),
        ),
    ),
    $('<div>').attr('class', 'form-group row').append(
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Expiration (s)'),
        $('<div>').attr('class', 'col-sm-3').append(
            $('<input>').attr({'class': 'form-control questionExpiration', 'name': 'questionExpiration', 'type':'number'})
        ),
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Notification (s)'),
        $('<div>').attr('class', 'col-sm-3').append(
            $('<input>').attr({'class': 'form-control questionTimeout', 'name': 'questionTimeout', 'type':'number'})
        )
    ),
    $('<select>').attr({'class': 'form-control mb-2', 'onchange': 'questionTypeChange(this)', 'name': 'questionType'}).append(
        $('<option>').attr('value', '').text('Please select the question type'),
        $('<option>').attr('value', 'ESM_Freetext').text('Free text'),
        $('<option>').attr('value', 'ESM_Likert').text('Likert scale'),
        $('<option>').attr('value', 'ESM_QuickAnswer').text('Quick answers'),
        $('<option>').attr('value', 'ESM_Scale').text('Slider'),
        $('<option>').attr('value', 'ESM_ScaleImage').text('Image based slider'),
    ),
    $('<div>').attr({'class': 'form-group paramsBlock'}),
);

// ******** ESM_Likert *****

// ESM_Likert block
var $likertBlock = $('<div>').append(
    $('<label>').attr({'class': 'text-md control-label col-form-label'}).text('Likert scale settings'),
    $('<div>').attr('class', 'separator '),
    $('<div>').attr('class', 'form-group row').append(
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Max'),
        $('<div>').attr('class', 'col-sm-3').append(
            $('<input>').attr({'class': 'form-control likertMax', 'name': 'likertMax', 'type':'number'})
        ),
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Min label'),
        $('<div>').attr('class', 'col-sm-3').append(
            $('<input>').attr({'class': 'form-control likertMinLabel', 'name': 'likertMinLabel', 'type':'text'}),
        ),
    ),
    $('<div>').attr('class', 'form-group row').append(
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Step'),
        $('<div>').attr('class', 'col-sm-3').append(
            $('<input>').attr({'class': 'form-control likertStep', 'name': 'likertStep', 'type':'number'}),
        ),
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Max label'),
        $('<div>').attr('class', 'col-sm-3').append(
            $('<input>').attr({'class': 'form-control likertMaxLabel', 'name': 'likertMaxLabel', 'type':'text'}),
        )
    )
);

// ******** ESM_QuickAnswer *****

// ESM_QuickAnswer block
var $quickAnswerBlock = $('<div>').append(
    $('<label>').attr({'class': 'text-md control-label col-form-label'}).text('Quick answer settings'),
    $('<div>').attr('class', 'separator'),
    $('<div>').attr('class', 'form-group row').append(
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Answer option'),
        $('<div>').attr('class', 'col-sm-9').append(
            $('<input>').attr({'class': 'form-control quickAnswers', 'name': 'quickAnswers', 'type':'text', 'placeholder': 'Comma separated list of answer options'})
        )
    ),
);

// ******** ESM_Scale *****

// ESM_Scale block
var $scaleBlock = $('<div>').append(
    $('<label>').attr({'class': 'text-md control-label col-form-label'}).text('Scale settings'),
    $('<div>').attr('class', 'separator'),
    $('<div>').attr('class', 'form-group row').append(
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Min'),
        $('<div>').attr('class', 'col-sm-3').append(
            $('<input>').attr({'class': 'form-control scaleMin', 'name': 'scaleMin', 'type':'number'}),
        ),
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Min label'),
        $('<div>').attr('class', 'col-sm-3').append(
            $('<input>').attr({'class': 'form-control scaleMinLabel', 'name': 'scaleMinLabel', 'type':'text'}),        
        ),
    ),
    $('<div>').attr('class', 'form-group row').append(
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Max'),
        $('<div>').attr('class', 'col-sm-3').append(
            $('<input>').attr({'class': 'form-control scaleMax', 'name': 'scaleMax', 'type':'number'}),
        ),
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Max label'),
        $('<div>').attr('class', 'col-sm-3').append(
            $('<input>').attr({'class': 'form-control scaleMaxLabel', 'name': 'scaleMaxLabel', 'type':'text'}),
        )
    ),
    $('<div>').attr('class', 'form-group row').append(
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Step'),
        $('<div>').attr('class', 'col-sm-3').append(
            $('<input>').attr({'class': 'form-control scaleStep', 'name': 'scaleStep', 'type':'number'}),
        )
    ),
    $('<div>').attr('class', 'form-group row').append(
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Start'),
        $('<div>').attr('class', 'col-sm-3').append(
            $('<input>').attr({'class': 'form-control scaleStart', 'name': 'scaleStart', 'type':'number'})
        )
    )
);

// ******** ESM_ScaleImage *****

// ESM_ScaleImage block
var $scaleImageBlock = $('<div>').append(
    $('<label>').attr({'class': 'text-md control-label col-form-label'}).text('Scale settings'),
    $('<div>').attr('class', 'separator'),
    $('<div>').attr('class', 'form-group row').append(
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Min'),
        $('<div>').attr('class', 'col-sm-3').append(
            $('<input>').attr({'class': 'form-control scaleMin', 'name': 'scaleMin', 'type':'number'}),
        ),
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Min label'),
        $('<div>').attr('class', 'col-sm-3').append(
            $('<input>').attr({'class': 'form-control scaleMinLabel', 'name': 'scaleMinLabel', 'type':'text'}),        
        ),
    ),
    $('<div>').attr('class', 'form-group row').append(
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Max'),
        $('<div>').attr('class', 'col-sm-3').append(
            $('<input>').attr({'class': 'form-control scaleMax', 'name': 'scaleMax', 'type':'number'}),
        ),
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Max label'),
        $('<div>').attr('class', 'col-sm-3').append(
            $('<input>').attr({'class': 'form-control scaleMaxLabel', 'name': 'scaleMaxLabel', 'type':'text'}),
        )
    ),
    $('<div>').attr('class', 'form-group row').append(
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Step'),
        $('<div>').attr('class', 'col-sm-3').append(
            $('<input>').attr({'class': 'form-control scaleStep', 'name': 'scaleStep', 'type':'number'}),
        )
    ),
    $('<div>').attr('class', 'form-group row').append(
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Start'),
        $('<div>').attr('class', 'col-sm-3 scaleStartTypeBlock').append(
            $('<div>').attr('class', 'form-check').append(
                $('<input>').attr({'class': 'form-check-input', 'name': 'scaleStartType', 'type': 'radio', 'value': 'fixed', 'onchange': 'startTypeChange(this)', 'checked':''}),
                $('<label>').attr('class', 'form-check-label').text('Fixed')
            ),
            $('<div>').attr('class', 'form-check').append(
                $('<input>').attr({'class': 'form-check-input', 'name': 'scaleStartType', 'type': 'radio', 'value': 'random', 'onchange': 'startTypeChange(this)'}),
                $('<label>').attr('class', 'form-check-label').text('Random')
            )
        ),
        $('<div>').attr('class', 'col-sm-3 scaleStartFixedBlock').append(
            $('<input>').attr({'class': 'form-control scaleStartFixed', 'name': 'scaleStartFixed', 'type':'number', 'placeholder': 'Value'})
        ),
    ),
    $('<div>').attr('class', 'form-group row').append(
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Left image URL'),
        $('<div>').attr('class', 'col-sm-9').append(
            $('<input>').attr({'class': 'form-control scaleURLleft', 'name': 'scaleURLleft', 'type':'text', 'required': ''}),
        )
    ),
    $('<div>').attr('class', 'form-group row').append(
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Right image URL'),
        $('<div>').attr('class', 'col-sm-9').append(
            $('<input>').attr({'class': 'form-control scaleURLright', 'name': 'scaleURLright', 'type':'text', 'required': ''}),
        )
    ),
);

// ESM scale fixed start settings
var $startFixedBlock = $('<div>').attr('class', 'col-sm-3 scaleStartFixedBlock').append(
    $('<input>').attr({'class': 'form-control scaleStartFixed', 'name': 'scaleStartFixed', 'type':'number', 'placeholder': 'Value'})
);

// ESM scale random start settings
var $startRandomBlock = $('<div>').attr('class', 'col-sm-3 scaleStartRandomTypeBlock').append(
    $('<div>').attr('class', 'form-check').append(
        $('<input>').attr({'class': 'form-check-input', 'name': 'scaleStartRandomType', 'type': 'radio', 'value': 'free', 'onchange': 'randomStartTypeChange(this)', 'checked':''}),
        $('<label>').attr('class', 'form-check-label').text('Free')
    ),
    $('<div>').attr('class', 'form-check').append(
        $('<input>').attr({'class': 'form-check-input', 'name': 'scaleStartRandomType', 'type': 'radio', 'value': 'interval', 'onchange': 'randomStartTypeChange(this)'}),
        $('<label>').attr('class', 'form-check-label').text('Intervals')
    )
);
var $scaleStartRandomIntervalBlock = $('<div>').attr('class', 'col-sm-3 scaleStartRandomIntervalBlock').append(
    $('<input>').attr({'class': 'form-control scaleStartRandomInterval', 'name': 'scaleStartRandomInterval', 'type':'number', 'placeholder': 'Number', 'disabled':''})
);

// ******** Schedule ********

// Schedule block
var $scheduleBlock = $('<div>').attr({'class': 'tab-pane-container scheduleBlock'}).append(
    $('<div>').attr('class', 'form-group row').append(
        $('<h3>').attr('class', 'col-lg-3 mb-0 schedule').text('Schedule '),
        $('<div>').attr('class', 'col-sm-9 d-flex justify-content-between').append(
            $('<div>').append(
                $('<button>').attr({'type': 'button', 'onclick': 'moveUp(this)', 'class': 'btn btn-md btn-editor js-scroll-trigger btn-medium mr-2'}).html('<i class="btn-i fas fa-angle-up"></i>'),
                $('<button>').attr({'type': 'button', 'onclick': 'moveDown(this)', 'class': 'btn btn-md btn-editor js-scroll-trigger btn-medium'}).html('<i class="btn-i fas fa-angle-down"></i>')
            ),
            $('<button>').attr({'type': 'button', 'onclick': 'removeBlock(this)', 'class': 'btn btn-md btn-editor js-scroll-trigger btn-red'}).text('Remove schedule')
        )
    ),
    $('<input>').attr({'name': 'scheduleNumber', 'type': 'hidden'}),
    $('<div>').attr('class', 'form-group row').append(
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Name*'),
        $('<div>').attr('class', 'col-sm-9').append(
            $('<input>').attr({'class': 'form-control scheduleName', 'name': 'scheduleName', 'type':'text', 'required': ''}),
        )
    ),
    $('<div>').attr('class', 'form-group row scheduleTypeBlock').append(
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Type'),
        $('<div>').attr('class', 'col-sm-9').append(
            $('<div>').attr('class', 'form-check-inline').append(
                $('<input>').attr({'class': 'form-check-input', 'name': 'scheduleType', 'type': 'radio', 'value': 'fixed', 'onchange': 'scheduleTypeChange(this)', 'checked':''}),
                $('<label>').attr('class', 'form-check-label').text('Fixed')
            ),
            $('<div>').attr('class', 'form-check-inline').append(
                $('<input>').attr({'class': 'form-check-input', 'name': 'scheduleType', 'type': 'radio', 'value': 'random', 'onchange': 'scheduleTypeChange(this)'}),
                $('<label>').attr('class', 'form-check-label').text('Random')
            ),
        )
    ),
    $('<div>').attr('class', 'form-group scheduleFixedBlock').append(
        $('<div>').attr('class', 'form-group row').append(
            $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Hours'),
            $('<div>').attr('class', 'col-sm-9').append(
                $('<input>').attr({'class': 'form-control scheduleFixedHours', 'name': 'scheduleFixedHours', 'type':'text', 'placeholder': 'Comma separated list'}),
            )
        ),
        $('<div>').attr('class', 'form-group row').append(
            $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Minutes'),
            $('<div>').attr('class', 'col-sm-9').append(
                $('<input>').attr({'class': 'form-control scheduleFixedMinutes', 'name': 'scheduleFixedMinutes', 'type':'text', 'placeholder': 'Comma separated list'})
            )
        ),
        $('<div>').attr('class', 'form-group row').append(
            $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Weekdays'),
            $('<div>').attr('class', 'col-sm-9').append(
                $('<input>').attr({'class': 'form-control scheduleFixedWeekdays', 'name': 'scheduleFixedWeekdays', 'type':'text', 'placeholder': 'Comma separated list'}),
            )
        ),
        $('<div>').attr('class', 'form-group row').append(
            $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Months'),
            $('<div>').attr('class', 'col-sm-9').append(
                $('<input>').attr({'class': 'form-control scheduleFixedMonths', 'name': 'scheduleFixedMonths', 'type':'text', 'placeholder': 'Comma separated list'})
            )
        ),
    ),
);

// Schedule fixed settings
var $scheduleFixedBlock = $('<div>').attr('class', 'form-group scheduleFixedBlock').append(
    $('<div>').attr('class', 'form-group row').append(
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Hours'),
        $('<div>').attr('class', 'col-sm-9').append(
            $('<input>').attr({'class': 'form-control scheduleFixedHours', 'name': 'scheduleFixedHours', 'type':'text', 'placeholder': 'Comma separated list'}),
        )
    ),
    $('<div>').attr('class', 'form-group row').append(
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Minutes'),
        $('<div>').attr('class', 'col-sm-9').append(
            $('<input>').attr({'class': 'form-control scheduleFixedMinutes', 'name': 'scheduleFixedMinutes', 'type':'text', 'placeholder': 'Comma separated list'})
        )
    ),
    $('<div>').attr('class', 'form-group row').append(
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Weekdays'),
        $('<div>').attr('class', 'col-sm-9').append(
            $('<input>').attr({'class': 'form-control scheduleFixedWeekdays', 'name': 'scheduleFixedWeekdays', 'type':'text', 'placeholder': 'Comma separated list'}),
        )
    ),
    $('<div>').attr('class', 'form-group row').append(
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Months'),
        $('<div>').attr('class', 'col-sm-9').append(
            $('<input>').attr({'class': 'form-control scheduleFixedMonths', 'name': 'scheduleFixedMonths', 'type':'text', 'placeholder': 'Comma separated list'})
        )
    ),
);

// Schedule random settings
var $scheduleRandomBlock = $('<div>').attr('class', 'form-group scheduleRandomBlock').append(
    $('<div>').attr('class', 'form-group row').append(
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Hours'),
        $('<div>').attr('class', 'col-sm-9').append(
            $('<input>').attr({'class': 'form-control scheduleRandomHours', 'name': 'scheduleRandomHours', 'type':'text', 'placeholder': 'Comma separated list'}),
        )
    ),
    $('<div>').attr('class', 'form-group row').append(
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Amount'),
        $('<div>').attr('class', 'col-sm-3').append(
            $('<input>').attr({'class': 'form-control scheduleRandomAmount', 'name': 'scheduleRandomAmount', 'type':'number', 'placeholder': 'Triggers per hour'})
        ),
        $('<label>').attr('class', 'col-lg-3 text-md control-label col-form-label').text('Interval'),
        $('<div>').attr('class', 'col-sm-3').append(
            $('<input>').attr({'class': 'form-control scheduleRandomInterval', 'name': 'scheduleRandomInterval', 'type':'number', 'placeholder': 'In minutes'})
        )
    ),
);

// ******** Overview ********

// Overview question block
var $overviewQuestionBlock = $('<div>').attr('class', 'overviewQuestionBlock mb-4').append(
    $('<div>').attr('class', 'form-overview row').append(
        $('<div>').attr('class', 'col-lg-2 text-md font-weight-bold overviewQuestionNumber').text(''),
        $('<div>').attr('class', 'col-sm-10 text-md overviewQuestionTitle').text('')
    ),
    $('<div>').attr('class', 'form-overview row').append(
        $('<div>').attr('class', 'col-lg-2 text-md font-weight-bold').text('Instructions'),
        $('<div>').attr('class', 'col-sm-10 text-md overviewQuestionInstructions').text('')
    ),
    $('<div>').attr('class', 'form-overview row').append(
        $('<div>').attr('class', 'col-lg-2 text-md font-weight-bold').text('Submit label'),
        $('<div>').attr('class', 'col-sm-4 text-md overviewQuestionSubmitText').text(''),
        $('<div>').attr('class', 'col-lg-2 text-md font-weight-bold').text('Cancel label'),
        $('<div>').attr('class', 'col-sm-4 text-md overviewQuestionCancelText').text('')
    ),
    $('<div>').attr('class', 'form-overview row').append(
        $('<div>').attr('class', 'col-lg-2 text-md font-weight-bold').text('Expiration'),
        $('<div>').attr('class', 'col-sm-4 text-md overviewQuestionExpiration').text(''),
        $('<div>').attr('class', 'col-lg-2 text-md font-weight-bold').text('Notification'),
        $('<div>').attr('class', 'col-sm-4 text-md overviewQuestionTimeout').text('')
    ),
    $('<div>').attr('class', 'form-overview row').append(
        $('<div>').attr('class', 'col-lg-2 text-md font-weight-bold').text('Type'),
        $('<div>').attr('class', 'col-sm-10 text-md overviewQuestionType').text('')
    ),
);

//Overview schedule block
var $overviewScheduleBlock = $('<div>').attr('class', 'overviewScheduleBlock mb-4').append(
    $('<div>').attr('class', 'form-overview row').append(
        $('<div>').attr('class', 'col-lg-2 text-md font-weight-bold overviewScheduleNumber').text(''),
        $('<div>').attr('class', 'col-sm-10 text-md overviewScheduleName').text('')
    ),
    $('<div>').attr('class', 'form-overview row').append(
        $('<div>').attr('class', 'col-lg-2 text-md font-weight-bold').text('Type'),
        $('<div>').attr('class', 'col-sm-10 text-md overviewScheduleType').text('')
    )
);

/************************************************/
/*****               FUNCTIONS             ******/
/************************************************/

// ******** Add new question *****
function addComponent() {
    // Find index
    var newIdx = 1;
    var $questions = $('.questionBlock');
    $questions.each(function(){
        var idx = parseInt($(this).attr('data-idx'));
        if (idx >= newIdx) {
            newIdx = idx + 1;
        }
    });

    // Create question block
    var $newQuestion = $questionBlock.clone();

    // Update blocks index
    $newQuestion.attr('data-idx', newIdx);
    $newQuestion.find('input[name="questionNumber"]').val(newIdx);
    $newQuestion.find('.paramsBlock').attr('data-idx', newIdx);
    $newQuestion.find('input[name="questionType"]').attr('name', 'questionType_'+newIdx);
    $newQuestion.find('.question').text('Question '+newIdx);

    // Add question block
    $('#addComponentButton').parent().before($newQuestion);
}

// ******** Add new schedule *****
function addSchedule() {
    // Find index
    var newIdx = 1;
    var $schedules = $('.scheduleBlock');
    $schedules.each(function(){
        var idx = parseInt($(this).attr('data-idx'));
        if (idx >= newIdx) {
            newIdx = idx + 1;
        }
    });

    // Create schedule block
    var $newSchedule = $scheduleBlock.clone();

    // Update blocks index
    $newSchedule.attr('data-idx', newIdx);
    $newSchedule.find('input[name="scheduleNumber"]').val(newIdx);
    $newSchedule.find('input[name="scheduleType"]').attr('name', 'scheduleType_'+newIdx);
    $newSchedule.find('.schedule').text('Schedule '+newIdx);

    // Add schedule block
    $('#addScheduleButton').parent().before($newSchedule);
}

// ***** Remove question or schedule block *****
function removeBlock(button) {
    $(button).parents('.questionBlock, .scheduleBlock').remove();
}

// ***** Move block up *****
function moveUp(btn){
    var $from = $(btn).parents('.tab-pane-container');
    var $to = $from.prev();
    if ($to.hasClass('tab-pane-container')) {
        $from.insertBefore($to);
    }
}

// ***** Move block down *****
function moveDown(btn){
    var $from = $(btn).parents('.tab-pane-container');
    var $to = $from.next();
    if ($to.hasClass('tab-pane-container')) {
        $from.insertAfter($to);
    }
}

// ***** Change question type *****
function questionTypeChange(select) {
    // Find index
    var idx = $(select).parent().data('idx');

    // Clear params block and create general params
    var $paramsBlock = $('.paramsBlock').filter('[data-idx="'+idx+'"]');
    $paramsBlock.empty();
    var $generalParams = $('.questionBlock').filter('[data-idx="'+idx+'"]');

    // Add ESM-specific params
    switch(select.value) {
        case "ESM_Freetext":
            var $params = null;
            break;
        case "ESM_Likert":
            var $params = $likertBlock.clone();
            break;
        case "ESM_QuickAnswer":
            var $params = $quickAnswerBlock.clone();
            // Remove submit and cancel buttons
            $generalParams.find(".questionSubmitText").parent().parent().remove();
            break;
        case "ESM_Scale":
            var $params = $scaleBlock.clone();
            break;
        case "ESM_ScaleImage":
            var $params = $scaleImageBlock.clone();
            // Add idx to scale start type block
            $params.find('input[name="scaleStartType"]').attr('name', 'scaleStartType_'+idx);
            $params.find('.scaleStartFixed').attr('name', 'scaleStartFixed_'+idx);
            $params.find('input[name="scaleValueVisible"]').attr('name', 'scaleValueVisible_'+idx);
            break;
        default:
            break;
    }

    // Add params block
    if ($params != null) $paramsBlock.append($params)
}

// ***** Change scale start type *****
function startTypeChange(radio) {
    // Find index
    var idx = $(radio).parents('.paramsBlock').data('idx');

    // Change start type block
    switch (radio.value) {
        case "fixed":
            $newBlock = $startFixedBlock.clone();
            $newBlock.find('.scaleStartFixed').attr('name', 'scaleStartFixed_'+idx);
            // Remove random start block
            $(radio).parents('.scaleStartTypeBlock').siblings('.scaleStartRandomTypeBlock, .scaleStartRandomIntervalBlock').remove();
            // Insert fixed start block
            $(radio).parents('.scaleStartTypeBlock').after($newBlock);
            break;
        case "random":
            $newBlock_1 = $startRandomBlock.clone();
            $newBlock_2 = $scaleStartRandomIntervalBlock.clone();
            $newBlock_2.find('.scaleStartRandomInterval').attr('name', 'scaleStartRandomInterval_'+idx);
            // Remove fixed start block
            $(radio).parents('.scaleStartTypeBlock').siblings('.scaleStartFixedBlock').remove();
            // Insert random start block
            $newBlock_1.find('input[name="scaleStartRandomType"]').attr('name', 'scaleStartRandomType_'+idx);
            $(radio).parents('.scaleStartTypeBlock').after($newBlock_1, $newBlock_2);
            break;
        default:
            break;
    }
}

// ***** Change scale start random type *****
function randomStartTypeChange(radio) {
    // Toggle value input
    $(radio).parents('.scaleStartRandomTypeBlock').siblings('.scaleStartRandomIntervalBlock').find('.scaleStartRandomInterval').prop('disabled', function(i, val) { return !val; });
}

// ***** Change schedule type *****
function scheduleTypeChange(radio) {
    // Change start type block
    switch (radio.value) {
        case "fixed":
            $newBlock = $scheduleFixedBlock.clone();
            // Remove random schedule block
            $(radio).parents('.scheduleTypeBlock').siblings('.scheduleRandomBlock').remove();
            // Insert fixed schedule block
            $(radio).parents('.scheduleTypeBlock').after($newBlock);
            break;
        case "random":
            $newBlock = $scheduleRandomBlock.clone();
            // Remove fixed schedule block
            $(radio).parents('.scheduleTypeBlock').siblings('.scheduleFixedBlock').remove();
            // Insert random schedule block
            $(radio).parents('.scheduleTypeBlock').after($newBlock);
            break;
        default:
            break;
    }
}

// ***** Retrieve questionnaire information *****
function retrieveInfo() {
    // General information
    $('#overviewInfoName').text($('#name').val());
    $('#overviewInfoShortName').text($('#short_name').val());
    $('#overviewInfoDescription').text($('#description').val());

    // Questions
    $('.overviewQuestionBlock').remove();

    $('.questionBlock').each(function() {
        var $q = $overviewQuestionBlock.clone();
        $q.find('.overviewQuestionNumber').text($(this).find('.question').text());
        $q.find('.overviewQuestionTitle').html($(this).find('input[name="questionTitle"]').val() + " <b>(" + $(this).find('select[name="questionLocale"]').val() + ")</b>");
        $q.find('.overviewQuestionInstructions').text($(this).find('textarea[name="questionInstructions"]').val());
        $q.find('.overviewQuestionSubmitText').text($(this).find('input[name="questionSubmitText"]').val());
        $q.find('.overviewQuestionCancelText').text($(this).find('input[name="questionCancelText"]').val());
        $q.find('.overviewQuestionExpiration').text($(this).find('input[name="questionExpiration"]').val());
        $q.find('.overviewQuestionThreshold').text($(this).find('input[name="questionThreshold"]').val());
        $q.find('.overviewQuestionType').text($(this).find('select[name="questionType"]').val());
        $('#overviewQuestions').append($q);
    })

    //Schedules
    $('.overviewScheduleBlock').remove();

    $('.scheduleBlock').each(function() {
        var $q = $overviewScheduleBlock.clone();
        $q.find('.overviewScheduleNumber').text($(this).find('.schedule').text());
        $q.find('.overviewScheduleName').text($(this).find('input[name="scheduleName"]').val());
        $q.find('.overviewScheduleType').text($(this).find('.form-check-input:checked').val());
        if ($(this).find('.form-check-input:checked').val() == 'fixed') {

        }
        $('#overviewSchedules').append($q);
    }) 
}

/*******************************************/
/*****               MAIN             ******/
/*******************************************/

$(document).ready(function(){
    $('#addComponentButton').click(addComponent);
    $('#addScheduleButton').click(addSchedule);

    $('#list-overview-list').click(retrieveInfo);
});