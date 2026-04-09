export class G5AboveCpmmon{
  public static validationGradeAboveG4AndAbove(gradeId:number){
    //G5
    if(gradeId === 205){
      return true
    }
    else if(gradeId === 206){
      return true
    }
     //G6
     else if(gradeId === 207){
      return true
    }
     //G7
     else if(gradeId === 208){
      return true
    }
     //G8
     else if(gradeId === 209){
      return true
    }
     //G9
     else if(gradeId === 210){
      return true
    }
      //G10
      else if(gradeId === 211){
        return true
      }
      else{
        return false
      }
  
   }
    public static validationGradeAboveG5AndAbove(gradeId:number){
        //G5
         if(gradeId === 206){
          return true
        }
         //G6
         else if(gradeId === 207){
          return true
        }
         //G7
         else if(gradeId === 208){
          return true
        }
         //G8
         else if(gradeId === 209){
          return true
        }
         //G9
         else if(gradeId === 210){
          return true
        }
          //G10
          else if(gradeId === 211){
            return true
          }
          else{
            return false
          }
      
       }
       public static validationGradeAboveG6AndAbove(gradeId:number){
      
         //G6
       if(gradeId === 207){
          return true
        }
         //G7
         else if(gradeId === 208){
          return true
        }
         //G8
         else if(gradeId === 209){
          return true
        }
         //G9
         else if(gradeId === 210){
          return true
        }
          //G10
          else if(gradeId === 211){
            return true
          }
          else{
            return false
          }
      
       }

       public static validationGradeG5ToG7AndAbove(gradeId:number){
        if(gradeId === 206){
          return true
        }
        //G6
     else if(gradeId === 207){
         return true
       }
        //G7
        else if(gradeId === 208){
         return true
       }
         else{
           return false
         }
     
      }


       public static validationGradeAboveG7AndAbove(gradeId:number){
        debugger
       //G7
        if(gradeId === 208){
          return true
        }
         //G8
         else if(gradeId === 209){
          return true
        }
         //G9
         else if(gradeId === 210){
          return true
        }
          //G10
          else if(gradeId === 211){
            return true
          }
          else{
            return false
          }
      
       }

       public static validationGradeBetweenG5ToG7(gradeId:number){
        if(gradeId === 206){
            return true
          }
           //G6
           else if(gradeId === 207){
            return true
          }
           //G7
           else if(gradeId === 208){
            return true
          }
          else{
            return false
          }
       
        }

        public static validationGradeAboveG8AndAbove(gradeId:number){
         
            //G8
          if(gradeId === 209){
             return true
           }
            //G9
            else if(gradeId === 210){
             return true
           }
             //G10
             else if(gradeId === 211){
               return true
             }
             else{
               return false
             }
         
          }

          public static validationGradeBandAvailable(gradeId:number){
            //G2
            if(gradeId === 203){
              return true
            }
            //G3-A
           else if(gradeId === 219){
              return true
            }
            //G3-B
            if(gradeId === 220){
              return true
            }
            
            //G4
            if(gradeId === 205){
              return true
            }
            //G5
            else if(gradeId === 206){
              return true
            }
             //G6
             else if(gradeId === 207){
              return true
            }
              
              else{
                return false
              }
          
           }
}