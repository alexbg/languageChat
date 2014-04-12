<?php

class SiteController extends Controller
{
	/**
	 * Declares class-based actions.
	 */
	public function actions()
	{
		return array(
			// captcha action renders the CAPTCHA image displayed on the contact page
			'captcha'=>array(
				'class'=>'CCaptchaAction',
				'backColor'=>0xFFFFFF,
			),
			// page action renders "static" pages stored under 'protected/views/site/pages'
			// They can be accessed via: index.php?r=site/page&view=FileName
			'page'=>array(
				'class'=>'CViewAction',
			),
		);
	}
        
        public function filters()
	{
		return array(
			'accessControl', // perform access control for CRUD operations
		);
	}
        
        public function accessRules()
	{
		return array(
			array('allow',  // allow all users to perform 'index' and 'view' actions
				'actions'=>array('login','index'),
				'users'=>array('*'),
			),
			array('allow', // allow authenticated user to perform 'create' and 'update' actions
				'actions'=>array('chat','logout','getGrid'),
				'users'=>array('@'),
			),
			array('deny',  // deny all users
				'users'=>array('*'),
			),
		);
	}

	/**
	 * This is the default 'index' action that is invoked
	 * when an action is not explicitly requested by users.
	 */
	public function actionIndex()
	{
		// renders the view file 'protected/views/site/index.php'
		// using the default layout 'protected/views/layouts/main.php'
		$this->render('index');
	}

	/**
	 * This is the action to handle external exceptions.
	 */
	public function actionError()
	{
		if($error=Yii::app()->errorHandler->error)
		{
			if(Yii::app()->request->isAjaxRequest)
				echo $error['message'];
			else
				$this->render('error', $error);
		}
	}

	/**
	 * Displays the contact page
	 */
	public function actionContact()
	{
		$model=new ContactForm;
		if(isset($_POST['ContactForm']))
		{
			$model->attributes=$_POST['ContactForm'];
			if($model->validate())
			{
				$name='=?UTF-8?B?'.base64_encode($model->name).'?=';
				$subject='=?UTF-8?B?'.base64_encode($model->subject).'?=';
				$headers="From: $name <{$model->email}>\r\n".
					"Reply-To: {$model->email}\r\n".
					"MIME-Version: 1.0\r\n".
					"Content-Type: text/plain; charset=UTF-8";

				mail(Yii::app()->params['adminEmail'],$subject,$model->body,$headers);
				Yii::app()->user->setFlash('contact','Thank you for contacting us. We will respond to you as soon as possible.');
				$this->refresh();
			}
		}
		$this->render('contact',array('model'=>$model));
	}
        
        public function actionChat(){
            
            /*$prueba;
            $class;
            
            foreach($_POST as $key=>$value){
                if($key!='total'){
                    $prueba[] = $value;
                    $class[] = $key;
                }
                
            }*/
            //echo var_dump($prueba);
            /*$dataProvider = new CArrayDataProvider($prueba,array(
                    'keyField'=>false
                ));*/
            // USAR EL server.sockets.clients() PARA GENERAR UN ARRAY Y 
            // PASARLE SIEMPRE EL ARRAY AL COMPLETO AL GRID PARA QUE
            // COMPRUEBE QUE HA CAMBIADO
            // 
            $user = Users::model()->findByPk(Yii::app()->user->id);
            $user->online = 1;
            if($user->save()){
                
                $dataProvider = new CActiveDataProvider('Users',array(
                    'criteria'=>array(
                        'condition'=>'online=true'
                        )
                    )
                );
                
                $total = Users::model()->count('online=1');
                
            }

            /*$total = Users::model()->count('online=1');
            }
            
            $dataProvider = new CActiveDataProvider('Users',array(
                'criteria'=>array(
                    'condition'=>'online=true'
                )
            ));
            
            $total = Users::model()->count('online=1');*/
            
            
            $this->render('chat',array('dataProvider'=>$dataProvider,'total'=>$total));
            
        }
        
        public function actionGetGrid(){
            
            $users = Array();
            $class;
            
            foreach($_POST as $key=>$value){
                if($key!='total'){
                    $users[] = $value;
                    $class[] = $key;
                }
                
            }
            //echo var_dump($prueba);
            $dataProvider = new CArrayDataProvider($users,array(
                    'keyField'=>false
                ));
            
            /*$dataProvider = new CActiveDataProvider('Users',array(
                'criteria'=>array(
                    'condition'=>'online=true'
                )
            ));*/
            //echo var_dump($prueba);
            $this->renderPartial('chatGrid',array('dataProvider'=>$dataProvider));
            
        }

	/**
	 * Displays the login page
	 */
	public function actionLogin()
	{
		$model=new LoginForm;

		// if it is ajax validation request
		if(isset($_POST['ajax']) && $_POST['ajax']==='login-form')
		{
			echo CActiveForm::validate($model);
			Yii::app()->end();
		}

		// collect user input data
		if(isset($_POST['LoginForm']))
		{
			$model->attributes=$_POST['LoginForm'];
                        //$model->password = CPasswordHelper::hashPassword($model->password); 
			// validate user input and redirect to the previous page if valid
			if($model->validate() && $model->login()){
                                
				$this->redirect(Yii::app()->user->returnUrl,array('login'=>true));
                        }
		}
		// display the login form
		$this->render('login',array('model'=>$model));
	}

	/**
	 * Logs out the current user and redirect to homepage.
	 */
	public function actionLogout()
	{
                $user = Users::model()->findByPk(Yii::app()->user->id);
                $user->online = 0;
                if($user->save()){
                    Yii::app()->user->logout();
                    Yii::app()->request->cookies->clear();
                }
		//Yii::app()->user->logout();
		$this->redirect(Yii::app()->homeUrl);
	}
}