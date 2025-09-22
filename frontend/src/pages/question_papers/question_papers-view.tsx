import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import {useRouter} from "next/router";
import { fetch } from '../../stores/question_papers/question_papersSlice'
import dataFormatter from '../../helpers/dataFormatter';
import LayoutAuthenticated from "../../layouts/Authenticated";
import {getPageTitle} from "../../config";
import SectionTitleLineWithButton from "../../components/SectionTitleLineWithButton";
import SectionMain from "../../components/SectionMain";
import CardBox from "../../components/CardBox";
import BaseButton from "../../components/BaseButton";
import BaseDivider from "../../components/BaseDivider";
import {mdiChartTimelineVariant} from "@mdi/js";
import {SwitchField} from "../../components/SwitchField";
import FormField from "../../components/FormField";

const Question_papersView = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { question_papers } = useAppSelector((state) => state.question_papers)

    const { id } = router.query;

    function removeLastCharacter(str) {
      console.log(str,`str`)
      return str.slice(0, -1);
    }

    useEffect(() => {
        dispatch(fetch({ id }));
    }, [dispatch, id]);

    return (
      <>
          <Head>
              <title>{getPageTitle('View question_papers')}</title>
          </Head>
          <SectionMain>
            <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={removeLastCharacter('View question_papers')} main>
                <BaseButton
                  color='info'
                  label='Edit'
                  href={`/question_papers/question_papers-edit/?id=${id}`}
                />
            </SectionTitleLineWithButton>
            <CardBox>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Title</p>
                    <p>{question_papers?.title}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Status</p>
                    <p>{question_papers?.status ?? 'No data'}</p>
                </div>

                <FormField label='SubmissionDate'>
                    {question_papers.submission_date ? <DatePicker
                      dateFormat="yyyy-MM-dd hh:mm"
                      showTimeSelect
                      selected={question_papers.submission_date ?
                        new Date(
                          dayjs(question_papers.submission_date).format('YYYY-MM-DD hh:mm'),
                        ) : null
                      }
                      disabled
                    /> : <p>No SubmissionDate</p>}
                </FormField>

                <>
                    <p className={'block font-bold mb-2'}>Questions QuestionPaper</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>Difficulty</th>

                            </tr>
                            </thead>
                            <tbody>
                            {question_papers.questions_question_paper && Array.isArray(question_papers.questions_question_paper) &&
                              question_papers.questions_question_paper.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/questions/questions-view/?id=${item.id}`)}>

                                    <td data-label="difficulty">
                                        { item.difficulty }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!question_papers?.questions_question_paper?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <BaseDivider />

                <BaseButton
                    color='info'
                    label='Back'
                    onClick={() => router.push('/question_papers/question_papers-list')}
                />
              </CardBox>
          </SectionMain>
      </>
    );
};

Question_papersView.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
    )
}

export default Question_papersView;
