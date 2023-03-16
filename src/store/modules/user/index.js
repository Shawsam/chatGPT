import { getMsgList } from '../../../api/http';

export default {
    state: {
        loginPanelShow:false,
        contactPanelShow:false,
        userId:'',
        records: [ ],
    },

    getters: {
      userId(state){
          let userId = state.userId
          if(userId){
            return userId
          }else{
            state.userId = localStorage.getItem('userId') 
            return state.userId  
          }
      },
      loginPanelShow(state){
          return state.loginPanelShow
      },
      contactPanelShow(state){
          return state.contactPanelShow
      },
      records(state){
        let records = state.records
        if(records){
          return records
        }else{
          state.records = JSON.parse(localStorage.getItem('records'))
          return state.records   
        }
      }
    },
    
    mutations: {
        loginPanelSet(state,status){
          return state.loginPanelShow = status
        },
        contactPanelSet(state,status){
          return state.contactPanelShow = status
        },
        userIdSet(state,id){
          localStorage.setItem('userId',id)
          return state.userId = id
        },
        recordSet(state,data){
          localStorage.setItem('records',JSON.stringify(data))
          return state.records = data
        }
    },

    actions: {
        async getRecords({commit,getters}){
          let userId = getters.userId
          if(userId){
            let res = await getMsgList(userId)
            let list = res.data.data.list
            commit('recordSet',list)
          }
        }
    }
}