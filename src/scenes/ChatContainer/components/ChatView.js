import React from 'react'
import PropTypes from 'prop-types'

import List, { ListItem, ListItemText } from 'material-ui/List'

const ChatView = ({ messages }) => (
  <div>
    <List>
      {messages &&
        Object.entries(messages).map(([id, message]) => (
          <ListItem key={id}>
            <ListItemText primary={message.text} />
          </ListItem>
        ))}
    </List>
  </div>
)

ChatView.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      from: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    })
  )
}

export default ChatView