<?php
/* @var $this SiteController */
/* @var $model LoginForm */
/* @var $form CActiveForm  */

$this->pageTitle=Yii::app()->name . ' - Login';
$this->breadcrumbs=array(
	'Login',
);

?>

<div class="row">

<h1>Login</h1>

<p>Are you new? <?php echo CHtml::link('Register',Yii::app()->createUrl('users/create')) ?></p>
<p>Please fill out the following form with your login credentials:</p>

<div class="form">
<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'login-form',
	'enableClientValidation'=>true,
	'clientOptions'=>array(
		'validateOnSubmit'=>true,
                'errorMessageCssClass'=>'error',
	),
)); ?>
        
            <div class="small-12 column">
		<?php echo $form->labelEx($model,'email'); ?>
		<?php echo $form->textField($model,'email',array('class'=>'error')); ?>
		<?php echo $form->error($model,'email',array('class'=>'error')); ?>
            </div>

            <div class="small-12 column">
		<?php echo $form->labelEx($model,'password'); ?>
		<?php echo $form->passwordField($model,'password',array('class'=>'error')); ?>
		<?php echo $form->error($model,'password',array('class'=>'error')); ?>
            </div>

            <div class="small-12 column">
		<?php echo $form->checkBox($model,'rememberMe'); ?>
		<?php echo $form->label($model,'rememberMe'); ?>
		<?php echo $form->error($model,'rememberMe'); ?>
            </div>

            <div class="small-12 column">
		<?php echo CHtml::submitButton('Login',array('class'=>'button')); ?>
            </div>

<?php $this->endWidget(); ?>
</div><!-- form -->
</div>