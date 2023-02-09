import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Collapse,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Link as MLink,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useServiceContext } from "../../providers/ServiceProvider";
import { useQuery } from "../../utils/useQuery";
import QueryData from "../shared/QueryData";
import Title from "../shared/Title";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import { styles } from "../../config/styles";
import { Trans } from "react-i18next";
import RichEditor from "../shared/rich-editor/RichEditor";
import InsertLinkRoundedIcon from "@mui/icons-material/InsertLinkRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import { t } from "i18next";
import { IDialogProps, IUserInfo, TQueryFunction } from "../../types";
import getUserName from "../../utils/getUserName";
import forLoopComponent from "../../utils/forLoop";
import { LoadingSkeleton } from "../shared/loadings/LoadingSkeleton";
import ProfileListItem from "../profile/ProfileListItem";
import toastError from "../../utils/toastError";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect, useRef, useState } from "react";
import MinimizeRoundedIcon from "@mui/icons-material/MinimizeRounded";
import { ICustomError } from "../../utils/CustomError";
import useDialog from "../../utils/useDialog";
import ProfileCEFromDialog from "../profile/ProfileCEFromDialog";
import { toast } from "react-toastify";
import ErrorEmptyData from "../shared/errors/ErrorEmptyData";
import SupTitleBreadcrumb from "../shared/SupTitleBreadcrumb";
import { useAuthContext } from "../../providers/AuthProvider";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import formatDate from "../../utils/formatDate";
import useMenu from "../../utils/useMenu";
import MoreActions from "../shared/MoreActions";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import useDocumentTitle from "../../utils/useDocumentTitle";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import ExpertGroupCEFormDialog from "./ExpertGroupCEFormDialog";

const ExpertGroupContainer = () => {
  const { service } = useServiceContext();
  const { expertGroupId } = useParams();
  const { userInfo } = useAuthContext();
  const queryData = useQuery({
    service: (args = { id: expertGroupId }, config) =>
      service.fetchUserExpertGroup(args, config),
  });

  const expertGroupMembersQueryData = useQuery({
    service: (args = { id: expertGroupId }, config) =>
      service.fetchExpertGroupMembers(args, config),
  });

  const setDocTitle = useDocumentTitle(t("expertGroup") as string);
  const createProfileDialogProps = useDialog({
    context: { type: "create", data: { expertGroupId } },
  });

  return (
    <QueryData
      {...queryData}
      render={(data) => {
        const {
          name,
          picture,
          website,
          about = "",
          number_of_members,
          number_of_profiles,
          users = [],
          bio,
          owner,
          is_expert = false,
          profiles = [],
        } = data || {};
        const hasAccess = userInfo.id === owner?.id || is_expert;
        setDocTitle(`${t("expertGroup")}: ${name || ""}`);

        return (
          <Box>
            <Title
              borderBottom
              pb={1}
              avatar={<Avatar src={picture} sx={{ mr: 1 }} />}
              // sub={bio}
              sup={
                <SupTitleBreadcrumb
                  routes={[
                    {
                      title: t("expertGroups") as string,
                      to: `/account/${userInfo.id}/expert-groups`,
                    },
                  ]}
                />
              }
              toolbar={
                <EditExpertGroupButton fetchExpertGroup={queryData.query} />
              }
            >
              {name}
            </Title>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={8}>
                {about && (
                  <>
                    <Title size="small">
                      <Trans i18nKey="about" />
                    </Title>
                    <Box
                      sx={{ p: 3, mt: 1, borderRadius: 2, background: "white" }}
                    >
                      <Box minHeight={"160px"} mb={4}>
                        <RichEditor content={about} />
                      </Box>
                    </Box>
                  </>
                )}
                <Box mt={5}>
                  <ProfilesList
                    queryData={queryData}
                    hasAccess={hasAccess}
                    dialogProps={createProfileDialogProps}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  p={2}
                  sx={{ borderRadius: 2, p: 3, background: "white", mt: 5 }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      display="flex"
                      alignItems={"center"}
                      sx={{ mb: 1.5 }}
                    >
                      <Trans i18nKey="groupSummary" />
                    </Typography>
                    {bio && (
                      <Box mt={1}>
                        <Typography>{bio}</Typography>
                      </Box>
                    )}
                    {website && (
                      <Box sx={{ ...styles.centerV, mt: 1 }}>
                        <InsertLinkRoundedIcon
                          fontSize="small"
                          sx={{
                            mr: 1,
                            transform: "rotateZ(-45deg)",
                            opacity: 0.8,
                          }}
                        />

                        <MLink
                          target="_blank"
                          href={website}
                          sx={{
                            textDecoration: "none",
                            opacity: 0.9,
                            fontWeight: "bold",
                          }}
                        >
                          {website
                            ?.replace("https://", "")
                            .replace("http://", "")}
                        </MLink>
                      </Box>
                    )}
                    <Box sx={{ ...styles.centerV, mt: 1, fontSize: ".9rem" }}>
                      <PeopleRoundedIcon
                        fontSize="small"
                        sx={{ mr: 1, opacity: 0.8 }}
                      />

                      <Typography
                        sx={{
                          opacity: 0.9,
                          fontSize: "inherit",
                        }}
                      >
                        {number_of_members} {t("members").toLowerCase()}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        ...styles.centerV,
                        mt: 1,
                        fontSize: ".9rem",
                        textDecoration: "none",
                        color: "inherit",
                      }}
                      component="a"
                      href="#profiles"
                    >
                      <AssignmentRoundedIcon
                        fontSize="small"
                        sx={{ mr: 1, opacity: 0.8 }}
                      />

                      <Typography
                        sx={{
                          opacity: 0.9,
                          fontSize: "inherit",
                        }}
                      >
                        {number_of_profiles} {t("profiles").toLowerCase()}
                      </Typography>
                      {hasAccess && (
                        <Box ml="auto">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                              console.log("here");
                              createProfileDialogProps.openDialog({
                                type: "create",
                                data: { expertGroupId },
                              });
                            }}
                          >
                            <AddRoundedIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                    <Divider sx={{ mt: 2, mb: 2 }} />
                  </Box>
                  {/* --------------------------- */}
                  <ExpertGroupMembers
                    {...expertGroupMembersQueryData}
                    hasAccess={hasAccess}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      }}
    />
  );
};

const EditExpertGroupButton = (props: any) => {
  const { fetchExpertGroup } = props;
  const { service } = useServiceContext();
  const { expertGroupId } = useParams();
  const queryData = useQuery({
    service: (args = { id: expertGroupId }, config) =>
      service.fetchUserExpertGroup(args, config),
    runOnMount: false,
  });
  const dialogProps = useDialog();

  const openEditDialog = async (e: any) => {
    const data = await queryData.query();
    dialogProps.openDialog({
      data,
      type: "update",
    });
  };

  return (
    <>
      <LoadingButton
        loading={queryData.loading}
        startIcon={<BorderColorRoundedIcon />}
        size="small"
        onClick={openEditDialog}
      >
        <Trans i18nKey="editExpertGroup" />
      </LoadingButton>
      <ExpertGroupCEFormDialog
        {...dialogProps}
        hideSubmitAndView={true}
        onSubmitForm={fetchExpertGroup}
      />
    </>
  );
};

const ExpertGroupMembers = (props: any) => {
  const { hasAccess, ...rest } = props;
  const [openInvitees, setOpenInvitees] = useState(false);
  const [openAddMembers, setOpenAddMembers] = useState(false);

  return (
    <QueryData
      {...rest}
      render={(data) => {
        const { results = [] } = data;
        const invitees = results.filter((user: any) => user.user === null);
        const users = results.filter((user: any) => user.user !== null);
        const hasInvitees = invitees.length > 0;

        return (
          <Box>
            <Typography
              variant="h6"
              display="flex"
              alignItems={"center"}
              sx={{ mb: 2 }}
            >
              <Trans i18nKey="members" />
            </Typography>
            {hasAccess && (
              <AddingNewMember
                queryData={rest}
                setOpenAddMembers={setOpenAddMembers}
                openAddMembers={openAddMembers}
              />
            )}
            {hasAccess && hasInvitees && (
              <Box mb={2}>
                <Invitees
                  users={invitees}
                  query={rest.query}
                  setOpenInvitees={setOpenInvitees}
                  openInvitees={openInvitees}
                />
              </Box>
            )}
            <Box sx={{ display: "flex", flexWrap: "wrap", mt: 1.5 }}>
              <AvatarGroup>
                {users.map((user: any) => {
                  const name = getUserName(user?.user);
                  return <Avatar alt={name} title={name} src="/" />;
                })}
              </AvatarGroup>
            </Box>
            {/* <Divider sx={{ mt: 2, mb: 2 }} /> */}
          </Box>
        );
      }}
    />
  );
};

const Invitees = (props: any) => {
  const { users, query, setOpenInvitees, openInvitees } = props;

  return (
    <Box>
      <Typography
        variant="h6"
        display="flex"
        alignItems={"center"}
        sx={{ fontSize: ".9rem", opacity: 0.8, cursor: "pointer" }}
        onClick={() => setOpenInvitees((state: boolean) => !state)}
      >
        <Trans i18nKey="invitees" />
        <Box
          sx={{
            ...styles.centerV,
            ml: "auto",
          }}
        >
          {openInvitees ? (
            <MinimizeRoundedIcon fontSize="small" />
          ) : (
            <AddRoundedIcon fontSize="small" />
          )}
        </Box>
      </Typography>
      <Collapse in={openInvitees}>
        <Box sx={{ display: "flex", flexWrap: "wrap", my: 1 }}>
          {users.map((user: any) => {
            const { invite_email, invite_expiration_date, id } = user;
            return (
              <Box
                key={user.id}
                sx={{
                  ...styles.centerV,
                  boxShadow: 1,
                  borderRadius: 2,
                  my: 0.5,
                  py: 0.8,
                  px: 1.5,
                  width: "100%",
                }}
              >
                <Box sx={{ ...styles.centerV }}>
                  <Box>
                    <Avatar sx={{ width: 34, height: 34 }} alt={invite_email} />
                  </Box>
                  <Box ml={2}>
                    {invite_email}
                    <Box sx={{ ...styles.centerV, opacity: 0.85 }}>
                      <EventBusyRoundedIcon
                        fontSize="small"
                        sx={{ mr: 0.7, opacity: 0.9 }}
                      />
                      <Typography variant="body2">
                        {formatDate(invite_expiration_date)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box ml="auto" sx={{ ...styles.centerV }}>
                  <MemberActions
                    query={query}
                    userId={id}
                    email={invite_email}
                    isInvitationExpired={true}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      </Collapse>
    </Box>
  );
};

const MemberActions = (props: any) => {
  const { query, userId, email, isInvitationExpired } = props;
  const { expertGroupId = "" } = useParams();
  const { service } = useServiceContext();
  const { query: deleteExpertGroupMember, loading } = useQuery({
    service: (arg, config) =>
      service.deleteExpertGroupMember(
        { id: expertGroupId, userId: userId },
        config
      ),
    runOnMount: false,
    toastError: true,
  });

  const addMemberQueryData = useQuery({
    service: (args, config) => service.addMemberToExpertGroup(args, config),
    runOnMount: false,
  });

  const deleteItem = async (e: any) => {
    await deleteExpertGroupMember();
    await query();
  };

  const inviteMember = async () => {
    try {
      const res = await addMemberQueryData.query({
        id: expertGroupId,
        email,
      });
      res?.message && toast.success(res.message);
      query();
    } catch (e) {
      const error = e as ICustomError;
      if ("message" in error.data || {}) {
        if (Array.isArray(error.data.message)) {
          toastError(error.data?.message[0]);
        } else if (error.data?.message) {
          toastError(error.data?.message);
        }
      }
    }
  };

  return (
    <MoreActions
      {...useMenu()}
      loading={loading}
      items={[
        isInvitationExpired
          ? {
              icon: <EmailRoundedIcon fontSize="small" />,
              text: <Trans i18nKey="resendAndInvitation" />,
              onClick: inviteMember,
            }
          : undefined,
        {
          icon: <DeleteRoundedIcon fontSize="small" />,
          text: <Trans i18nKey="delete" />,
          onClick: deleteItem,
        },
      ]}
    />
  );
};

const AddingNewMember = (props: any) => {
  const { queryData, setOpenAddMembers, openAddMembers } = props;

  return (
    <Box>
      <Typography
        variant="h6"
        display="flex"
        alignItems={"center"}
        sx={{ mb: 2, fontSize: ".9rem", opacity: 0.8, cursor: "pointer" }}
        onClick={() => setOpenAddMembers((state: boolean) => !state)}
      >
        <Trans i18nKey="addMember" />
        <Box
          sx={{
            ...styles.centerV,
            ml: "auto",
          }}
        >
          {openAddMembers ? (
            <MinimizeRoundedIcon fontSize="small" />
          ) : (
            <AddRoundedIcon fontSize="small" />
          )}
        </Box>
      </Typography>
      <Collapse in={openAddMembers}>
        <AddMember queryData={queryData} />
      </Collapse>
    </Box>
  );
};

const AddMember = (props: any) => {
  const { queryData } = props;
  const { query } = queryData;
  const inputRef = useRef<HTMLInputElement>(null);
  const { service } = useServiceContext();
  const { expertGroupId } = useParams();
  const addMemberQueryData = useQuery({
    service: (args, config) => service.addMemberToExpertGroup(args, config),
    runOnMount: false,
  });

  const addMember = async () => {
    try {
      const res = await addMemberQueryData.query({
        id: expertGroupId,
        email: inputRef.current?.value,
      });
      res?.message && toast.success(res.message);
      query();
    } catch (e) {
      const error = e as ICustomError;
      if ("message" in error.data || {}) {
        if (Array.isArray(error.data.message)) {
          toastError(error.data?.message[0]);
        } else if (error.data?.message) {
          toastError(error.data?.message);
        }
      }
    }
  };

  return (
    <Box
      component="form"
      sx={{ mb: 2, mt: 0 }}
      onSubmit={(e) => {
        e.preventDefault();
        if (!inputRef.current?.value) {
          toastError(t("pleaseEnterEmailAddress") as string);
        } else addMember();
      }}
    >
      <TextField
        fullWidth
        type={"email"}
        size="small"
        variant="outlined"
        inputRef={inputRef}
        placeholder={t("enterEmailOfTheUserYouWantToAdd") as string}
        label={<Trans i18nKey="userEmail" />}
        InputProps={{
          endAdornment: (
            <AddMemberButton loading={addMemberQueryData.loading} />
          ),
        }}
      />
    </Box>
  );
};

const AddMemberButton = ({ loading }: { loading: boolean }) => {
  return (
    <InputAdornment position="end">
      <LoadingButton
        sx={{
          mr: "-10px",
          minWidth: "10px",
          p: 0.5,
        }}
        loading={loading}
        type="submit"
        variant="contained"
        size="small"
      >
        <AddRoundedIcon fontSize="small" />
      </LoadingButton>
    </InputAdornment>
  );
};

const ProfilesList = (props: any) => {
  const { hasAccess, dialogProps, about } = props;
  const { expertGroupId } = useParams();
  const { service } = useServiceContext();
  const profileQuery = useQuery({
    service: (args = { id: expertGroupId }, config) =>
      service.fetchExpertGroupProfiles(args, config),
  });

  return (
    <>
      <Title
        inPageLink="profiles"
        size="small"
        toolbar={
          hasAccess && (
            <CreateProfileButton
              onSubmitForm={profileQuery.query}
              dialogProps={dialogProps}
            />
          )
        }
      >
        <Trans i18nKey={"profiles"} />
      </Title>
      <Box mt={2}>
        <QueryData
          {...profileQuery}
          emptyDataComponent={
            <Box sx={{ background: "white", borderRadius: 2 }}>
              <ErrorEmptyData
                emptyMessage={<Trans i18nKey="thereIsNoProfileYet" />}
              />
            </Box>
          }
          renderLoading={() => (
            <>
              {forLoopComponent(5, (index) => (
                <LoadingSkeleton key={index} sx={{ height: "60px", mb: 1 }} />
              ))}
            </>
          )}
          render={(data = []) => {
            return (
              <>
                {data.map((profile: any) => {
                  return (
                    <ProfileListItem
                      link={
                        hasAccess
                          ? `profiles/${profile?.id}`
                          : `/profiles/${profile?.id}`
                      }
                      key={profile?.id}
                      data={profile}
                      fetchProfiles={profileQuery.query}
                      hasAccess={hasAccess}
                    />
                  );
                })}
              </>
            );
          }}
        />
      </Box>
    </>
  );
};

const CreateProfileButton = (props: {
  onSubmitForm: TQueryFunction;
  dialogProps: IDialogProps;
}) => {
  const { onSubmitForm, dialogProps } = props;

  return (
    <>
      <Button variant="contained" size="small" onClick={dialogProps.openDialog}>
        <Trans i18nKey="createProfile" />
      </Button>
      <ProfileCEFromDialog {...dialogProps} onSubmitForm={onSubmitForm} />
    </>
  );
};

export default ExpertGroupContainer;
