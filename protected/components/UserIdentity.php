<?php

/**
 * UserIdentity represents the data needed to identity a user.
 * It contains the authentication method that checks if the provided
 * data can identity the user.
 */
class UserIdentity extends CUserIdentity
{
	private $_id;
        public function authenticate()
        {
            $record=Users::model()->findByAttributes(array('email'=>$this->email));
            
            if($record===null)
                $this->errorCode=self::ERROR_USERNAME_INVALID;
            else if(!CPasswordHelper::verifyPassword($this->password,$record->password))
                $this->errorCode=self::ERROR_PASSWORD_INVALID;
            else
            {
                $record->online = 0;
                if($record->save()){
                    $this->_id=$record->id;
                    $this->setState('username', $record->username);
                    $this->setState('id', $record->id);
                    Yii::app()->request->cookies['username'] = new CHttpCookie('username',$record->username);
                    Yii::app()->request->cookies['native'] = new CHttpCookie('native',$record->native_language);
                    Yii::app()->request->cookies['foreign'] = new CHttpCookie('foreign',$record->foreign_language);
                    Yii::app()->request->cookies['start'] = new CHttpCookie('start',true);
                    $this->errorCode=self::ERROR_NONE;
                }
                else{
                    $this->errorCode=self::ERROR_PASSWORD_INVALID;
                }
            }  
            return !$this->errorCode;
        }

        public function getId()
        {
            return $this->_id;
        }
}