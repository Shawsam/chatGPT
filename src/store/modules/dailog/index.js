import { getMsgDetail, consDelete } from '../../../api/http';
export default {
    state: {
        show:false,
        msgList: [],
        consId:'',
        isFilling:false,
        askVal:''
    },

    getters: {
       dialogShow(state){
          return state.show
       },
       msgList(state){
         return state.msgList
       },
       consId(state){
         return state.consId
       },
       isFilling(state){
         return state.isFilling
       },
       askVal(state){
         return state.askVal
      },
    },
    
    mutations: {
        newDialog(state){
           state.msgList = []
           state.show = false
           state.askVal = ''
           state.consId = ''
        },
        Dialoging(state){
           state.show = true
        },
        msgListAdd(state,data){
           state.msgList.push(data)
        },
        msgListSet(state,data){
           console.log(data)
           state.msgList = data
           state.show = true
        },
        msgListClear(state){
           state.msgList = []
        },
        consIdSet(state,id){
           state.consId = id
        },
        fillStateSet(state,status){
           state.isFilling = status
        },
        askValSet(state,val){
           state.askVal = val
      },
    },

    actions: {
         async getMsgList({commit,getters},id){
            let userId = getters.userId
            if(userId){
              let res = await getMsgDetail(userId,id)
              let list = res.data.data.list
              console.log(list)
              let msgList = []
              for(let i in list){
                for(let j in list[i]){
                  msgList.push(list[i][j])
                }
              }
              console.log(msgList)
              commit('msgListSet',msgList)
            }
         },
         async consDel({commit, dispatch,getters},id){
            let consId = getters.consId
            let res = await consDelete(id)
            if(res.data.code==0){
               if(consId == id){
                  commit('newDialog','')
               }
               dispatch('getRecords')
            }
         }
    }
}