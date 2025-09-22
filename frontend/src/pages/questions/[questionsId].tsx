import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'

import { Field, Form, Formik } from 'formik'
import FormField from '../../components/FormField'
import BaseDivider from '../../components/BaseDivider'
import BaseButtons from '../../components/BaseButtons'
import BaseButton from '../../components/BaseButton'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup'
import { SelectField } from "../../components/SelectField";
import { SelectFieldMany } from "../../components/SelectFieldMany";
import { SwitchField } from '../../components/SwitchField'
import {RichTextField} from "../../components/RichTextField";

import { update, fetch } from '../../stores/questions/questionsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'

const EditQuestions = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    content: '',

    difficulty: '',

    question_paper: null,

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { questions } = useAppSelector((state) => state.questions)

  const { questionsId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: questionsId }))
  }, [questionsId])

  useEffect(() => {
    if (typeof questions === 'object') {
      setInitialValues(questions)
    }
  }, [questions])

  useEffect(() => {
      if (typeof questions === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (questions)[el])

          setInitialValues(newInitialVal);
      }
  }, [questions])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: questionsId, data }))
    await router.push('/questions/questions-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit questions')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit questions'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

    <FormField label='Content' hasTextareaHeight>
        <Field
            name='content'
            id='content'
            component={RichTextField}
        ></Field>
    </FormField>

    <FormField label="Difficulty" labelFor="difficulty">
        <Field name="difficulty" id="difficulty" component="select">

            <option value="Easy">Easy</option>

            <option value="Medium">Medium</option>

            <option value="Hard">Hard</option>

        </Field>
    </FormField>

    <FormField label='QuestionPaper' labelFor='question_paper'>
        <Field
            name='question_paper'
            id='question_paper'
            component={SelectField}
            options={initialValues.question_paper}
            itemRef={'question_papers'}

            showField={'title'}

        ></Field>
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/questions/questions-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditQuestions.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditQuestions
