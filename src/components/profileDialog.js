import firebase from "gatsby-plugin-firebase"
import React, { useCallback, useContext, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { GalleryContext } from "../contexts/gallery"
import { LanguageContext, useTranslate } from "../contexts/language"
import { NotifyContext } from "../contexts/notify"
import { TangramsContext } from "../contexts/tangrams"
import { UserContext } from "../contexts/user"
import { Badge } from "./badge"
import { DangerButton, PrimaryButton } from "./button"
import { Dialog } from "./dialog"
import { Input } from "./input"
import { Error, Similink, Title } from "./primitives"
import { Text } from "./text"
import { View } from "./view"
import { DIALOG_CLOSED_REASON } from "../constants"

const ChangeEmailForm = ({ currentUser, onClose }) => {
  const { updateEmail } = useContext(UserContext)
  const t = useTranslate()
  const notify = useContext(NotifyContext)
  const { handleSubmit, register, setError, errors, formState } = useForm()

  const onSubmit = useCallback(
    async ({ password, newEmail }) => {
      try {
        await updateEmail(currentUser, password, newEmail)
        notify(t("Email address updated sucessfuly"))
        onClose()
      } catch (error) {
        console.log(error)
        switch (error.code) {
          case "auth/email-already-in-use":
            setError(
              "newEmail",
              "alreadyExists",
              t("Email address already in use")
            )
            break
          case "auth/invalid-email":
            setError("newEmail", "invalid", t("Invalid email address"))
            break
          case "auth/wrong-password":
            setError("password", "mismatch", t("Incorrect password"))
            break
          default:
            notify(t("An error occured, please retry later"))
            return
        }
      }
    },
    [currentUser, updateEmail, setError, onClose, t, notify]
  )

  return (
    <View
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      css={{ flex: "1", gap: 4 }}
    >
      <View css={{ gap: 3, overflow: "auto", flex: "1" }}>
        <View css={{ gap: 2 }}>
          <label>{t("Password")}</label>
          <Input
            type="password"
            name="password"
            ref={register({ required: t("Password is required") })}
          ></Input>
          {errors.password && <Error>{errors.password.message}</Error>}
        </View>
        <View css={{ gap: 2 }}>
          <label>{t("New email address")}</label>
          <Input
            type="email"
            name="newEmail"
            ref={register({ required: t("Email address is required") })}
          ></Input>
          {errors.newEmail && <Error>{errors.newEmail.message}</Error>}
        </View>
      </View>

      <View css={{ gap: 3 }}>
        <PrimaryButton disabled={formState.isSubmitting} type="submit">
          {t("Change email address")}
        </PrimaryButton>

        <View
          css={{
            alignItems: "center",
          }}
        >
          <Similink onClick={onClose}>{t("Back")}</Similink>
        </View>
      </View>
    </View>
  )
}

const ChangeUsernameForm = ({ currentUser, onClose }) => {
  const { updateUsername } = useContext(UserContext)
  const t = useTranslate()
  const notify = useContext(NotifyContext)
  const { handleSubmit, register, errors, formState } = useForm()

  const onSubmit = useCallback(
    async ({ newUsername }) => {
      try {
        await updateUsername(currentUser, newUsername)
        notify(t("Username updated sucessfuly"))
        onClose()
      } catch (error) {
        console.log(error)
        notify(t("An error occured, please retry later"))
      }
    },
    [currentUser, updateUsername, onClose, t, notify]
  )

  return (
    <View
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      css={{ flex: "1", gap: 4 }}
    >
      <View css={{ gap: 3, overflow: "auto", flex: "1" }}>
        <View css={{ gap: 2 }}>
          <label>{t("New username")}</label>
          <Input
            type="text"
            name="newUsername"
            ref={register({ required: t("Username is required") })}
          ></Input>
          {errors.newUsername && <Error>{errors.newUsername.message}</Error>}
        </View>
      </View>

      <View css={{ gap: 3 }}>
        <PrimaryButton disabled={formState.isSubmitting} type="submit">
          {t("Change username")}
        </PrimaryButton>
        <View
          css={{
            alignItems: "center",
          }}
        >
          <Similink onClick={onClose}>{t("Back")}</Similink>
        </View>
      </View>
    </View>
  )
}

const ChangePasswordForm = ({ currentUser, onClose }) => {
  const { updateUsername } = useContext(UserContext)

  const t = useTranslate()
  const notify = useContext(NotifyContext)

  const {
    handleSubmit,
    register,
    watch,
    setError,
    errors,
    formState,
  } = useForm()

  const newPassword = watch("newPassword")

  const onSubmit = useCallback(
    async ({ password, newPassword }) => {
      try {
        await updateUsername(currentUser, password, newPassword)
        notify(t("Password changed sucessfuly"))
        onClose()
      } catch (error) {
        switch (error.code) {
          case "auth/weak-password":
            setError("newPassword", "weakPassword", t("Password is too weak"))
            break
          case "auth/wrong-password":
            setError("password", "mismatch", t("Incorrect password"))
            break
          default:
            notify(t("An error occured, please retry later"))
            return
        }
      }
    },
    [currentUser, updateUsername, onClose, setError, t, notify]
  )

  return (
    <View
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      css={{ flex: "1", gap: 4 }}
    >
      <View css={{ gap: 3, overflow: "auto", flex: "1" }}>
        <View css={{ gap: 2 }}>
          <label>{t("Current password")}</label>
          <Input
            type="password"
            name="password"
            ref={register({ required: t("Password is required") })}
          ></Input>
          {errors.password && <Error>{errors.password.message}</Error>}
        </View>
        <View css={{ gap: 2 }}>
          <label>{t("New password")}</label>
          <Input
            type="password"
            name="newPassword"
            ref={register({ required: t("Password is required") })}
          ></Input>
          {errors.newPassword && <Error>{errors.newPassword.message}</Error>}
        </View>

        <View css={{ gap: 2 }}>
          <label>{t("Confirm new password")}</label>
          <Input
            type="password"
            name="newPasswordConfirm"
            ref={register({
              required: "Password is required",
              validate: (newPasswordConfirm) =>
                newPasswordConfirm === newPassword || t("Passwords must match"),
            })}
          ></Input>
          {errors.newPasswordConfirm && (
            <Error>{errors.newPasswordConfirm.message}</Error>
          )}
        </View>
      </View>

      <View css={{ gap: 3 }}>
        <PrimaryButton disabled={formState.isSubmitting} type="submit">
          {t("Change password")}
        </PrimaryButton>
        <View
          css={{
            alignItems: "center",
          }}
        >
          <Similink onClick={onClose}>{t("Back")}</Similink>
        </View>
      </View>
    </View>
  )
}
export const ProfileDialog = ({ uid, deferred }) => {
  const t = useTranslate()
  const notify = useContext(NotifyContext)

  const { language } = useContext(LanguageContext)
  const { completedTangrams } = useContext(GalleryContext)
  const { currentUser, usersMetadata } = useContext(UserContext)
  const { username, signupDate } = usersMetadata[uid]
  const [changeEmailRequested, setChangeEmailRequested] = useState(false)
  const [changeUsernameRequested, setChangeUsernameRequested] = useState(false)
  const [changePasswordRequested, setChangePasswordRequested] = useState(false)
  const tangrams = useContext(TangramsContext)

  const { claps, completed, created } = useMemo(() => {
    let claps = 0
    let completed = 0
    let created = 0
    for (const tangram of tangrams) {
      if (tangram.uid === uid) {
        claps += tangram.claps || 0
        if (tangram.approved) {
          created++
        }
      }
      if (completedTangrams[tangram.id]) {
        completed++
      }
    }
    return { claps, completed, created }
  }, [completedTangrams, tangrams, uid])

  const handleLogout = async () => {
    if (window.confirm(t("Are you sure you want to log out?"))) {
      await firebase.auth().signOut()
      deferred.reject(DIALOG_CLOSED_REASON)
      notify(t("Logged out"))
    }
  }

  return (
    <Dialog
      onClose={() => deferred.reject(DIALOG_CLOSED_REASON)}
      css={{
        flex: "1",
        minWidth: "268px",
        overflow: "auto",
        pt: 4,
        mt: -4,
        gap: 3,
      }}
    >
      {changeEmailRequested ? (
        <ChangeEmailForm
          currentUser={currentUser}
          onClose={() => setChangeEmailRequested(false)}
        ></ChangeEmailForm>
      ) : changeUsernameRequested ? (
        <ChangeUsernameForm
          currentUser={currentUser}
          onClose={() => setChangeUsernameRequested(false)}
        ></ChangeUsernameForm>
      ) : changePasswordRequested ? (
        <ChangePasswordForm
          currentUser={currentUser}
          onClose={() => setChangePasswordRequested(false)}
        />
      ) : (
        <View css={{ gap: 4 }}>
          <View css={{ gap: 3, alignItems: "center" }}>
            <Badge uid={uid} size={86} css={{}}></Badge>
            <Title>{username}</Title>
            <View css={{ gap: 2, fontSize: 2, alignItems: "center" }}>
              {currentUser && uid === currentUser.uid && (
                <Text css={{ fontSize: 2 }}>
                  {currentUser.firebaseUser.email}
                </Text>
              )}
              <Text css={{ fontSize: 2 }}>
                {t("Joined {signupDate}", {
                  signupDate: new Intl.DateTimeFormat(language).format(
                    signupDate
                  ),
                })}
              </Text>
              <Text>
                {t("Completed {completed}/{total} tangrams", {
                  completed,
                  total: tangrams.length,
                })}
              </Text>
              <Text>
                {t("Created {created} tangrams", {
                  created,
                })}
              </Text>
              <Text>
                {t("Earned {claps} 👏", {
                  claps,
                })}
              </Text>
            </View>
          </View>
          <View css={{ gap: 3, alignItems: "center" }}>
            <Similink onClick={() => setChangeEmailRequested(true)}>
              {t("Change email address")}
            </Similink>
            <Similink onClick={() => setChangeUsernameRequested(true)}>
              {t("Change username")}
            </Similink>
            <Similink onClick={() => setChangePasswordRequested(true)}>
              {t("Change password")}
            </Similink>
          </View>

          <DangerButton onClick={handleLogout}>{t("Log out")}</DangerButton>
        </View>
      )}
    </Dialog>
  )
}
