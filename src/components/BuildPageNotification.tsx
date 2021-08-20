// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { useState } from "react";
import { MdClose, MdEdit } from "react-icons/md";
import { BsQuestion } from "react-icons/bs";
import { Link, useHistory } from "react-router-dom";
import { useUIState } from "../contexts/UIContext";
import { BuildMetaInfo } from "../pages/BuildPage";
import DynamicPortal from "./DynamicPortal";
import Gutter from "./Gutter";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;

  width: 100%;
`;

const ColoredGutter = styled(Gutter)`
  position: relative;
  /* border: 1px solid red; */

  display: flex;
  justify-content: flex-end;
  /* background-color: ${({ theme }) => theme.colors.surface.main}; */

  /* border-bottom: 1px solid ${({ theme }) => theme.colors.primary.main}; */
`;

const NotificationContainer = styled(motion.div)`
  /* overflow: hidden; */
  position: relative;

  margin-top: 1rem;
  /* padding: 0.5rem 0; */
  min-height: 3rem;
  border-radius: 5px;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: black;
`;

const NotificationText = styled.p`
  color: white;
  /* margin: 0.5rem; */

  font-weight: 600;

  white-space: nowrap;
`;

const Span = styled.span`
  cursor: pointer;

  color: inherit;
  font-weight: inherit;
  white-space: inherit;
  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.colors.error.main};
  }
`;

const LoginLink = styled(Link)`
  margin-left: 0.2rem;

  &:link,
  &:visited,
  &:hover,
  &:active {
    color: white;
    font-weight: 700;
    font-style: italic;
    text-decoration: underline;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const MoreDetailsPopUp = styled.div`
  position: absolute;
  top: 100%;
  left: 0;

  margin-top: 1rem;
  padding: 1rem;
  /* border: 1px solid red; */

  width: 100%;

  border-radius: 5px;
  background-color: black;
`;

const Header = styled.h2``;

const List = styled.ul``;

const Detail = styled.li``;

const EditButton = styled.button`
  margin-left: 0.5rem;
  padding: 0.5rem 1rem;

  background-color: ${({ theme }) => theme.colors.primary.main};
  border-radius: 5rem;

  text-transform: uppercase;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onPrimary.main};
`;

const CloseNotificationButton = styled.button`
  position: absolute;
  right: 0;

  min-width: 3rem;
  min-height: 3rem;

  background-color: transparent;

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    path {
      fill: white;
    }
  }

  &:hover {
    svg {
      path {
        fill: ${({ theme }) => theme.colors.error.main};
      }
    }
  }
`;

/**
 * if the build DOES belong to the user
 *
 * "user": none
 *
 * "local":
 * - You are not logged in.
 * - Your builds are only saved locally, which means you will lose and/or not have access
 *   to your data if you do any of the following:
 *      1. Switch to another device or browser
 *      2. Clear your browser's local storage
 * - Your build comments are not shareable.
 * - This build can only be shared using the provided shareable link
 *   i.e. (not using the browser's current url)
 *
 * "anon": This build is not yours. Edit.
 *
 */

/**
 * if the build does NOT belong to the user
 *
 * "user": This build is not yours. Edit.
 *
 * "local": This build is not yours. Edit.
 *
 * "anon": This build is not yours. Edit.
 *
 */

const getNotificationMessageComponent = (
  info: BuildMetaInfo,
  isMobile: boolean,
  editButtonAction: () => void,
  toggleDetails: () => void
) => {
  const { buildType, isCreator } = info;

  const notYourBuildComponent = (
    <>
      <NotificationText>This is not your build!</NotificationText>
      <EditButton type="button" onClick={editButtonAction}>
        edit{" ->"}
      </EditButton>
    </>
  );

  switch (buildType) {
    case "user":
      if (isCreator) return null;
      else return notYourBuildComponent;

    case "local":
      if (isCreator)
        return isMobile ? (
          <Container>
            <NotificationText>
              You are not logged in. <LoginLink to="/account">Login</LoginLink>
            </NotificationText>
            <NotificationText>
              Some features are <Span onClick={toggleDetails}>disabled</Span>.
            </NotificationText>
          </Container>
        ) : (
          <>
            <NotificationText>
              You are not logged in. Some features are{" "}
              <Span onClick={toggleDetails}>disabled</Span>.
              <LoginLink to="/account">Login -&#62;</LoginLink>
            </NotificationText>
          </>
        );
      else return notYourBuildComponent;

    case "anon":
      return notYourBuildComponent;

    default:
      return null;
  }
};

type Props = { metaInfo: BuildMetaInfo; editButtonAction: () => void };

const BuildPageNotification = ({ metaInfo, editButtonAction }: Props) => {
  const { isMobile } = useUIState();
  const [showNotif, setShowNotif] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => setShowDetails((v) => !v);

  const notificationComponent = getNotificationMessageComponent(
    metaInfo,
    isMobile,
    editButtonAction,
    toggleDetails
  );

  const notificationAnimProps = {
    variants: {
      show: {
        // borderRadius: "5px",
        width: "100%",
        // height: "3rem",
      },
      shrink: {
        // borderRadius: "50%",
        width: "3rem",
        // height: "3rem",
      },
    },
    transition: {
      duration: 0.25,
    },
    initial: showNotif ? "show" : "shrink",
    animate: showNotif ? "show" : "shrink",
  };

  const closeAll = () => {
    setShowNotif((v) => !v);
    setShowDetails(false);
  };

  if (!notificationComponent) return null;

  return (
    <DynamicPortal portalId="main-notification">
      <ColoredGutter>
        <NotificationContainer {...notificationAnimProps}>
          {showNotif && notificationComponent}

          <CloseNotificationButton type="button" onClick={closeAll}>
            {showNotif ? <MdClose /> : <MdEdit />}
          </CloseNotificationButton>

          {showDetails && (
            <MoreDetailsPopUp>
              <Header>Without an account:</Header>

              <List>
                <Detail>
                  Your build <span>comments</span> are not shareable.
                </Detail>
                <Detail>
                  Your build can only be shared using the provided shareable
                  link (a longer url).
                </Detail>
                <Detail>
                  <Header>
                    Your build data is unnavailable or deleted if:
                  </Header>
                  <List>
                    <Detail>Switch to another device or browser</Detail>
                    <Detail>Clear your browser's local storage</Detail>
                  </List>
                </Detail>
              </List>
            </MoreDetailsPopUp>
          )}
        </NotificationContainer>
      </ColoredGutter>
    </DynamicPortal>
  );
};

export default BuildPageNotification;
