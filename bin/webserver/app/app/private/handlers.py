import os
from flask import request, current_app
from xml.etree.ElementTree import ElementTree, Element, SubElement

def generate_xml(idx):
    '''
    This function retrieves the form data submitted through the request POST and generates a XML  file, returning the file path
    '''

    # Questionnaire settings -------------------------------

    questionnaire = Element('ESMDefinition')
    questionnaire.set('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
    questionnaire.set('xsi:noNamespaceSchemaLocation', 'file:///ESMDefinition.xsd')
    name = SubElement(questionnaire, 'name')
    name.text = request.form['name']
    short_name = SubElement(questionnaire, 'short_name')
    short_name.text = request.form['short_name']
    if request.form['description']: 
        description = SubElement(questionnaire, 'description')
        description.text = request.form['description']

    # Question general settings -------------------------------

    nFreeText = 0
    nLikert = 0
    nQuickAnswer = 0
    nScale = 0
    nScaleImage = 0

    qTypes = request.form.getlist('questionType')

    if len(qTypes) is not 0:
        for n, q in enumerate(qTypes): # n = idx, q = question type
            if q:
                nQuestion = request.form.getlist('questionNumber')[n]
                nSubmit = n - nQuickAnswer # Except questions with no 'submit' or 'cancel' buttons
                nScaleGeneral = nScale + nScaleImage # For general settings of scale / scaleImage

                question = SubElement(questionnaire, 'Question')
                esm_type = SubElement(question, 'ESM_Type')
                esm_type.text = q
                if request.form.getlist('questionTitle')[n]:
                    qTitle = SubElement(question, 'Title')
                    qTitle.text = request.form.getlist('questionTitle')[n]
                if request.form.getlist('questionInstructions')[n]:
                    qInstructions = SubElement(question, 'Instructions')
                    qInstructions.text = request.form.getlist('questionInstructions')[n]
                if q != 'ESM_QuickAnswer':
                    if request.form.getlist('questionSubmitText')[nSubmit]:
                        qSubmit = SubElement(question, 'SubmitText')
                        qSubmit.text = request.form.getlist('questionSubmitText')[nSubmit]
                    if request.form.getlist('questionCancelText')[nSubmit]:
                        qCancel = SubElement(question, 'CancelText')
                        qCancel.text = request.form.getlist('questionCancelText')[nSubmit]
                if request.form.getlist('questionExpiration')[n]:
                    qExpiration = SubElement(question, 'ExpirationThreshold')
                    qExpiration.text = request.form.getlist('questionExpiration')[n]
                if request.form.getlist('questionTimeout')[n]:
                    qTimeout = SubElement(question, 'NotificationTimeout')
                    qTimeout.text = request.form.getlist('questionTimeout')[n]

    # Question type settings -------------------------------  

                # ESM_FreeText --------
                if q == 'ESM_FreeText':
                    
                    nFreeText += 1

                # ESM_QuickAnswer --------
                if q == 'ESM_QuickAnswer':
                    options = SubElement(question, 'Options')
                    answers = (request.form.getlist('quickAnswers')[nQuickAnswer]).split(',')
                    if answers != ['']:
                        for ans in answers:
                            option = SubElement(options, 'Option')
                            option.text = ans
                    
                    nQuickAnswer += 1

                # ESM_Likert --------
                if q == 'ESM_Likert':
                    lOptions = SubElement(question, 'LikertOptions')

                    # Likert options
                    if request.form.getlist('likertMax')[nLikert]:
                        lMax = SubElement(lOptions, 'LikertMax')
                        lMax.text = request.form.getlist('likertMax')[nLikert]
                    if request.form.getlist('likertMaxLabel')[nLikert]:
                        lMaxLabel = SubElement(lOptions, 'LikertMaxLabel')
                        lMaxLabel.text = request.form.getlist('likertMaxLabel')[nLikert]
                    if request.form.getlist('likertMinLabel')[nLikert]:
                        lMinLabel = SubElement(lOptions, 'LikertMinLabel')
                        lMinLabel.text = request.form.getlist('likertMinLabel')[nLikert]
                    if request.form.getlist('likertStep')[nLikert]:
                        lStep = SubElement(lOptions, 'LikertStep')
                        lStep.text = request.form.getlist('likertStep')[nLikert]

                    nLikert += 1

                # ESM_Scale --------
                if q == 'ESM_Scale':
                    sOptions = SubElement(question, 'ScaleOptions')

                    # Scale options
                    if request.form.getlist('scaleStart')[nScale]:
                        sMaxLabel = SubElement(sOptions, 'ScaleStart')
                        sMaxLabel.text = request.form.getlist('scaleStart')[nScale]
                    if request.form.getlist('scaleStep')[nScaleGeneral]:
                        sStep = SubElement(sOptions, 'ScaleStep')
                        sStep.text = request.form.getlist('scaleStep')[nScaleGeneral]
                    if request.form.getlist('scaleMin')[nScaleGeneral]:
                        sMin = SubElement(sOptions, 'ScaleMin')
                        sMin.text = request.form.getlist('scaleMin')[nScaleGeneral]
                    if request.form.getlist('scaleMinLabel')[nScaleGeneral]:
                        sMinLabel = SubElement(sOptions, 'ScaleMinLabel')
                        sMinLabel.text = request.form.getlist('scaleMinLabel')[nScaleGeneral]
                    if request.form.getlist('scaleMax')[nScaleGeneral]:
                        sMax = SubElement(sOptions, 'ScaleMax')
                        sMax.text = request.form.getlist('scaleMax')[nScaleGeneral]
                    if request.form.getlist('scaleMaxLabel')[nScaleGeneral]:
                        sMaxLabel = SubElement(sOptions, 'ScaleMaxLabel')
                        sMaxLabel.text = request.form.getlist('scaleMaxLabel')[nScaleGeneral]

                    nScale += 1
      
                # ESM_ScaleImage --------
                if q == 'ESM_ScaleImage':
                    sOptions = SubElement(question, 'ScaleOptions')
                    # Scale start random
                    if request.form.get('scaleStartType_'+str(nQuestion)) == 'random':
                        sStartType = SubElement(sOptions, 'ScaleStartRandom')
                        sStartType.text = 'true'
                        if (request.form.get('scaleStartRandomType_'+str(nQuestion)) == 'interval') and request.form.get('scaleStartRandomInterval_'+str(nQuestion)): # Scale start random intervals (check that intervals is checked and there is a value written)
                            sRandomIntervals = SubElement(sOptions, 'ScaleStartRandomValues')
                            sRandomIntervals.text = request.form.get('scaleStartRandomInterval_'+str(nQuestion))
                    # Scale start fixed
                    else:
                        if request.form.get('scaleStartFixed_'+str(nQuestion)):
                            sStart = SubElement(sOptions, 'ScaleStart')
                            sStart.text = request.form.get('scaleStartFixed_'+str(nQuestion))
                    
                    # Scale options
                    if request.form.getlist('scaleStep')[nScaleGeneral]:
                        sStep = SubElement(sOptions, 'ScaleStep')
                        sStep.text = request.form.getlist('scaleStep')[nScaleGeneral]
                    if request.form.getlist('scaleMin')[nScaleGeneral]:
                        sMin = SubElement(sOptions, 'ScaleMin')
                        sMin.text = request.form.getlist('scaleMin')[nScaleGeneral]
                    if request.form.getlist('scaleMinLabel')[nScaleGeneral]:
                        sMinLabel = SubElement(sOptions, 'ScaleMinLabel')
                        sMinLabel.text = request.form.getlist('scaleMinLabel')[nScaleGeneral]
                    if request.form.getlist('scaleMax')[nScaleGeneral]:
                        sMax = SubElement(sOptions, 'ScaleMax')
                        sMax.text = request.form.getlist('scaleMax')[nScaleGeneral]
                    if request.form.getlist('scaleMaxLabel')[nScaleGeneral]:
                        sMaxLabel = SubElement(sOptions, 'ScaleMaxLabel')
                        sMaxLabel.text = request.form.getlist('scaleMaxLabel')[nScaleGeneral]
                    if request.form.get('scaleValueVisible_'+str(nQuestion)):
                        sValueVisible = SubElement(sOptions, 'ScaleValueVisible')
                        sValueVisible.text = request.form.get('scaleValueVisible_'+str(nQuestion))
                    if request.form.getlist('scaleURLleft')[nScaleImage]:
                        sLeftUrl = SubElement(sOptions, 'LeftImageUrl')
                        sLeftUrl.text = request.form.getlist('scaleURLleft')[nScaleImage]
                    if request.form.getlist('scaleURLright')[nScaleImage]:
                        sRightUrl = SubElement(sOptions, 'RightImageUrl')
                        sRightUrl.text = request.form.getlist('scaleURLright')[nScaleImage]

                    nScaleImage += 1

    # Schedule settings -------------------------------

    nFixed = 0
    nRandom = 0

    for key in request.form.to_dict(): # The key of the dict is the name of the property
        if key.startswith('scheduleType'):
            value = request.form.get(key) # We get the value of this key
            nSchedule = request.form.getlist('scheduleNumber')[nFixed+nRandom]
            schedule = SubElement(questionnaire, 'Schedule')
            schName = SubElement(schedule, 'id')
            schName.text = request.form.getlist('scheduleName')[nFixed+nRandom]

            # Fixed schedule, create one element per comma separated value
            if value == 'fixed': 
                hours = (request.form.getlist('scheduleFixedHours')[nFixed]).split(',')
                if hours != ['']:
                    for h in hours:
                        schHour = SubElement(schedule, 'hour')
                        schHour.text = h
                mins = (request.form.getlist('scheduleFixedMinutes')[nFixed]).split(',')
                if mins != ['']:
                    for m in mins:
                        schMin = SubElement(schedule, 'minute')
                        schMin.text = m
                days = (request.form.getlist('scheduleFixedWeekdays')[nFixed]).split(',')
                if days != ['']:
                    for d in days:
                        schDay = SubElement(schedule, 'weekday')
                        schDay.text = d
                months = (request.form.getlist('scheduleFixedMonths')[nFixed]).split(',')
                if months != ['']:
                    for m in months:
                        schMonth = SubElement(schedule, 'month')
                        schMonth.text = m
                nFixed += 1
                
            # Random schedule
            if value == 'random': 
                hours = (request.form.getlist('scheduleRandomHours')[nRandom]).split(',')
                if hours != ['']:
                    for h in hours:
                        schRandomHour = SubElement(schedule, 'hour')
                        schRandomHour.text = h
                schRandom = SubElement(schedule, 'random')
                schRandom.text = 'true'
                if request.form.getlist('scheduleRandomAmount')[nRandom]:
                    schRandomAmount = SubElement(schedule, 'amount')
                    schRandomAmount.text = request.form.getlist('scheduleRandomAmount')[nRandom]
                if request.form.getlist('scheduleRandomInterval')[nRandom]:
                    schRandomInterval = SubElement(schedule, 'interval')
                    schRandomInterval.text = request.form.getlist('scheduleRandomInterval')[nRandom]
                nRandom += 1

    # Save XML file -------------------------------

    filepath = os.path.join(current_app.config['XML_DIR'], 'questionnaire_'+str(idx)+'.xml')
    
    with open(filepath, "wb") as f:
        tree = ElementTree(questionnaire)
        tree.write(f, encoding='UTF-8', xml_declaration=True)

    return filepath