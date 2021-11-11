const listPublicEventsSchema = {
  title: 'list public events schema v1',
  type: 'object',
  required: [],
  properties: {
    status: {
      type: 'number'
    },
    body: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          type: {
            type: 'string'
          },
          actor: {
            type: 'object',
            properties: {
              id: {
                type: 'integer'
              },
              login: {
                type: 'string'
              },
              display_login: {
                type: 'string'
              },
              gravatar_id: {
                type: 'string'
              },
              url: {
                type: 'string'
              },
              avatar_url: {
                type: 'string'
              }
            },
            required: [
              'id',
              'login',
              'display_login',
              'gravatar_id',
              'url',
              'avatar_url'
            ]
          },
          repo: {
            type: 'object',
            properties: {
              id: {
                type: 'integer'
              },
              name: {
                type: 'string'
              },
              url: {
                type: 'string'
              }
            },
            required: [
              'id',
              'name',
              'url'
            ]
          },
          payload: {
            type: 'object',
            properties: {
              ref: {
                type: ['null', 'string']
              },
              ref_type: {
                type: 'string'
              },
              master_branch: {
                type: 'string'
              },
              description: {
                type: ['string', 'null']
              },
              pusher_type: {
                type: 'string'
              }
            }
          },
          public: {
            type: 'boolean'
          },
          created_at: {
            type: 'string'
          }
        }
      }
    }
  }
};

exports.listPublicEventsSchema = listPublicEventsSchema;
