import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import Title from "@common/Title";
import { EAssessmentStatus, useQuestionContext } from "@/providers/QuestionProvider";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import GradingRoundedIcon from "@mui/icons-material/GradingRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import { IQuestionnaireModel } from "@types";
import SupTitleBreadcrumb, { useSupTitleBreadcrumb } from "@common/SupTitleBreadcrumb";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import { t } from "i18next";
import setDocumentTitle from "@utils/setDocumentTitle";

const QuestionsTitle = (props: { data: IQuestionnaireModel; isReview?: boolean,pathInfo:any }) => {
  const { data, isReview,pathInfo } = props;
  const { title } = data || {};
  const {
    questionsInfo: { total_number_of_questions },
    assessmentStatus,
    isSubmitting,
  } = useQuestionContext();
  const { spaceId, assessmentId, questionIndex, questionnaireId,page } = useParams();
  const isComplete = questionIndex === "completed";
  const canFinishQuestionnaire = !isComplete && !isReview;
  const{space,assessment}=pathInfo

  useEffect(() => {
    if (isComplete) {
      setDocumentTitle(`${title} ${t("questionnaireFinished")}`);
    }
  }, [title, isComplete]);

  return (
    <Box sx={{ pt: 1, pb: 0 }}>
      <Title
        wrapperProps={{
          sx: {
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "flex-end" },
            display: { xs: "block", sm: "flex" },
          },
        }}
        toolbar={
          <Box sx={{ mt: { xs: 1.5, sm: 0 } }}>
            {!isReview && (
              <Button
                disabled={isSubmitting}
                component={Link}
                to={isReview ? "./../.." : "./.."}
                sx={{ mr: 1 }}
                startIcon={<QuizRoundedIcon />}
              >
                <Trans i18nKey="selectAnotherQuestionnaire" />
              </Button>
            )}
            {canFinishQuestionnaire && (
              <Button disabled={isSubmitting} component={Link} to={"./review"} startIcon={<GradingRoundedIcon />}>
                <Trans i18nKey="review" />
              </Button>
            )}
          </Box>
        }
        backLink={-1}
        sup={
          <SupTitleBreadcrumb
            routes={[
              {
                title: space?.title,
                to: `/${spaceId}/assessments/${page}`,
                icon: <FolderRoundedIcon fontSize="inherit" sx={{ mr: 0.5 }} />,
              },
              {
                title: `${assessment?.title} ${t("questionnaires")}`,
                to: `/${spaceId}/assessments/${page}/${assessmentId}/questionnaires`,
                icon: <DescriptionRoundedIcon fontSize="inherit" sx={{ mr: 0.5 }} />,
              },
              {
                title,
                to: `/${spaceId}/assessments/${page}/${assessmentId}/questionnaires`,
                icon: <QuizRoundedIcon fontSize="inherit" sx={{ mr: 0.5 }} />,
              },
            ]}
          />
        }
      >
        {isReview ? (
          <>
            {title}
            <Typography display="inline-block" variant="h5" sx={{ opacity: 0.6, marginLeft: 1, fontWeight: "bold" }}>
              <Trans i18nKey="review" />
            </Typography>
          </>
        ) : (
          <>
            {assessmentStatus === EAssessmentStatus.DONE && (
              <AssignmentTurnedInRoundedIcon sx={{ mr: 0.5, opacity: 0.6 }} fontSize="large" />
            )}
            <Box display="block">
              {title}{" "}
              {assessmentStatus === EAssessmentStatus.DONE ? (
                <Typography
                  display="inline-flex"
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    opacity: 0.6,
                    ml: { xs: 0, sm: 1 },
                    alignItems: "center",
                  }}
                >
                  <Trans i18nKey="questionnaireFinished" />
                </Typography>
              ) : (
                <Typography display="inline-block" variant="h5" fontWeight={"bold"} sx={{ opacity: 0.6, ml: { xs: 0, sm: 1 } }}>
                  {" "}
                  <Trans i18nKey="question" /> {questionIndex}/{total_number_of_questions}
                </Typography>
              )}
            </Box>
          </>
        )}
      </Title>
    </Box>
  );
};

export default QuestionsTitle;
