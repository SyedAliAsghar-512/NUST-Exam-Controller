import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
    tagTypes: ["Order", "AdminOrders"],
    endpoints: (builder) => ({
                createNewOrder: builder.mutation({
                    query(body) {
                       return {
                          url: "/orders/new",
                          method: "POST",
                          body,
                    }
                 }
             }),
             myClasses: builder.query({
              query: () => `/me/classes`,
         }),
         myAttendance: builder.query({
            query: (id) => `/me/classes/attendance/${id}`,
       }),
       datesheet: builder.query({
         query: (batchId) => `/datesheet/${batchId}`,
    }),
    getSubjects: builder.query({
      query: () => `/subjects`,
 }),
 getSubjectsByBatch: builder.query({
   query: (batchId) => `/subjects/${batchId}`,
}),
 auDatesheet: builder.mutation({
   query({ batchId, schedule, batch }) {
     return {
       url: `/audatesheet`,  // ✅ batchId not in URL
       method: "POST",
       body: { batchId, schedule, batch },  // ✅ batchId in body
     };
   },
 }),
 
    saveSubjects: builder.mutation({
      query({rooms}) {
         return {
            url: `/subjects`,
            method: "POST",
            body: {rooms},
      }
   }
}),
saveRoomsConfig: builder.mutation({
   query(body) {
      return {
         url: `/postroomsconfig`,
         method: "POST",
         body,
   }
}
}),
getRooms: builder.query({
   query: () => `/fetchroomsconfig`,
}),
         myOrders: builder.query({
            query: () => `/me/classe`,
       }),
       getAccess: builder.query({
         query: () => `/getaccess`,
    }),
    changeAccess: builder.mutation({
      query() {
         return {
            url: `/toggleaccess`,
            method: "PUT",
      }
   }
}),
getDatesheets: builder.query({
   query: () => `/datesheets`,
}),
getBatchDatesheet: builder.query({
   query: (batch) => `/datesheet/${batch}`,
}),
getStudentBatchDatesheet: builder.query({
   query: (studentBatch) => `/datesheet/${studentBatch}`,
}),
editDatesheet: builder.mutation({
query({ id, schedule }) {
   return {
      url: `/datesheets/${id}`,
      method: "PUT",
      body: { schedule }
}
}
}),
         orderDetails: builder.query({
            query: (id) => `/order/${id}`,
            providesTags: ["Order"]
       }),
             stripeCheckoutSession: builder.mutation({
                query(body) {
                   return {
                      url: "/payment/checkout_session",
                      method: "POST",
                      body,
                }
            }
        }),
        getDashboardSales: builder.query({
            query: ({startDate, endDate}) => `/admin/getsales/?startDate=${startDate}&endDate=${endDate}`,
       }),
       getAdminOrders: builder.query({
         query: () => `/admin/orders`,
         providesTags: ["AdminOrders"]
    }),
    updateOrder: builder.mutation({
        query({id, body}) {
           return {
              url: `/admin/orders/${id}`,
              method: "PUT",
              body,
        }
     },
     invalidatesTags: ["Order","AdminOrders"]
 }),
 deleteOrder: builder.mutation({
   query(id) {
      return {
         url: `/admin/orders/${id}`,
         method: "DELETE",
   }
},
invalidatesTags: ["Order","AdminOrders"]
}),
    }),
});
        
export const {useGetRoomsQuery, useSaveRoomsConfigMutation, useLazyGetSubjectsByBatchQuery, useGetBatchDatesheetQuery, useGetStudentBatchDatesheetQuery, useEditDatesheetMutation, useGetDatesheetsQuery,useGetAccessQuery,useChangeAccessMutation,useGetSubjectsQuery, useSaveSubjectsMutation, useAuDatesheetMutation, useDatesheetQuery, useCreateNewOrderMutation, useStripeCheckoutSessionMutation, useMyClassesQuery, useMyAttendanceQuery, useMyOrdersQuery,
useOrderDetailsQuery, useLazyGetDashboardSalesQuery, useGetAdminOrdersQuery, useUpdateOrderMutation, useDeleteOrderMutation} = orderApi