import React from 'react'
import { connect } from 'react-redux'

import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'

import DisplayMap from './components/DisplayMap'
import ProjectDetails from './components/ProjectDetails'
import ButtonJoinDelete from './components/ButtonJoinDelete'
import ParticipantList from './components/ParticipantList'
import UserChip from '../../components/UserChip'
import Conversation from '../../components/Conversation'
import ButtonStartDiscussion from './components/ButtonStartDiscussion'

import { authenticatedUser } from '../../data/user/selectors'
import { create as createComment } from '../../data/comment/actions'
import { projectWithId } from '../../data/project/selectors'
import {
  addParticipant,
  removeParticipant,
  approveParticipant,
  remove as removeProject
} from '../../data/project/actions'

import { isOwner, isParticipant, isPendingParticipant } from '../../data/utils'

class Project extends React.Component {
  handleNewMessage = text =>
    this.props.createComment({
      from: this.props.authenticatedUser.id,
      to: this.props.project.id,
      text
    })

  handleAddParticipant = () =>
    this.props.addParticipant(
      this.props.project.id,
      this.props.authenticatedUser.id
    )

  handleRemoveParticipant = () =>
    this.props.removeParticipant(
      this.props.project.id,
      this.props.authenticatedUser.id
    )

  handleRemoveProject = () => this.props.removeProject(this.props.project.id)

  canParticipate = () =>
    this.props.authenticatedUser &&
    this.props.authenticatedUser.homeHub === this.props.project.hub.id

  buildParticipantList = project => {
    let chips = project.participants.map(participant => (
      <UserChip key={participant.id} user={participant} />
    ))
    if (isOwner(this.props.authenticatedUser)(project)) {
      chips = chips.concat(
        project.pendingParticipants.map(participant => (
          <UserChip
            key={participant.id}
            user={participant}
            altIcon="approve"
            onAltClick={() =>
              this.props.approveParticipant(project.id, participant.id)
            }
          />
        ))
      )
    } else if (isPendingParticipant(this.props.authenticatedUser)(project)) {
      chips = chips.concat([
        <UserChip
          key={this.props.authenticatedUser.id}
          user={this.props.authenticatedUser}
          altIcon="pending"
          onAltClick={() => {}}
        />
      ])
    }
    return chips
  }

  render() {
    const { authenticatedUser, project } = this.props

    return !project ? null : (
      <div>
        <Typography variant="display2">{project.name}</Typography>
        <Grid container>
          <Grid item>
            <DisplayMap
              location={
                project.location ? project.location : project.hub.location
              }
            />
            <Typography variant="subheading">{project.place}</Typography>
          </Grid>
          <Grid item>
            <ProjectDetails hourlyAward={15} project={project} />
            <div>
              <Typography variant="body1">Organized by</Typography>
              <UserChip user={project.owner} />
            </div>
            <Grid container>
              {(isParticipant(authenticatedUser)(project) ||
                isOwner(authenticatedUser)(project)) &&
                project.discussion && (
                  <ButtonStartDiscussion
                    authenticatedUser={authenticatedUser}
                    topic="project"
                    url={`/discussions/${project.discussion.id}`}
                  />
                )}
              <ButtonJoinDelete
                authenticatedUser={authenticatedUser}
                project={project}
                addParticipant={this.handleAddParticipant}
                removeParticipant={this.handleRemoveParticipant}
                removeProject={this.handleRemoveProject}
              />
            </Grid>
          </Grid>
        </Grid>
        {project.benefit && (
          <div>
            <Typography variant="display1">
              How will this benefit the community?
            </Typography>
            <Typography>{project.benefit}</Typography>
          </div>
        )}
        <div>{authenticatedUser && <div />}</div>

        <ParticipantList isOwner={isOwner(authenticatedUser)(project)}>
          {this.buildParticipantList(project)}
        </ParticipantList>
        {(this.canParticipate() || project.comments.length > 0) && (
          <div>
            <Typography variant="display1">Talk about the project</Typography>
            <Conversation
              messages={project.comments}
              disableNewMessages={!this.canParticipate()}
              onNewMessage={this.handleNewMessage}
            />
          </div>
        )}
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const projectId = ownProps.match.params.projectId

  return {
    authenticatedUser: authenticatedUser(state),
    project: projectWithId(projectId)(state)
  }
}

const mapDispatchToProps = {
  addParticipant,
  removeParticipant,
  approveParticipant,
  removeProject,
  createComment
}

export default connect(mapStateToProps, mapDispatchToProps)(Project)
