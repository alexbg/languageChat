<?php
/* @var $this UsersController */
/* @var $model Users */
/* @var $form CActiveForm */
?>

<div class="form">

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'users-form',
	// Please note: When you enable ajax validation, make sure the corresponding
	// controller action is handling ajax validation correctly.
	// There is a call to performAjaxValidation() commented in generated controller code.
	// See class documentation of CActiveForm for details on this.
	'enableAjaxValidation'=>false,
        'enableClientValidation'=>true,
        'clientOptions' => array(
            'validateOnSubmit'=>true,
            'validateOnChange'=>true,
            'validateOnType'=>false,
            )
)); ?>

	<p class="note">Fields with <span class="required">*</span> are required.</p>

	<?php //echo $form->errorSummary($model); ?>
        
            <div class="small-12 column">
		<?php echo $form->labelEx($model,'email'); ?>
		<?php echo $form->textField($model,'email',array('size'=>60,'maxlength'=>255),array('class'=>"error")); ?>
		<?php echo $form->error($model,'email',array('class'=>"error")); ?>
            </div>

            <div class="small-12 column">
		<?php echo $form->labelEx($model,'password'); ?>
		<?php echo $form->passwordField($model,'password',array('size'=>60,'maxlength'=>255),array('class'=>"error")); ?>
		<?php echo $form->error($model,'password',array('class'=>"error")); ?>
            </div>

            <div class="small-12 column">
		<?php echo $form->labelEx($model,'username'); ?>
		<?php echo $form->textField($model,'username',array('size'=>60,'maxlength'=>60),array('class'=>"error")); ?>
		<?php echo $form->error($model,'username',array('class'=>"error")); ?>
            </div>

            <div class="small-12 column">
		<?php echo $form->labelEx($model,'native_language'); ?>
		<?php echo $form->textField($model,'native_language',array('size'=>60,'maxlength'=>255),array('class'=>"error")); ?>
		<?php echo $form->error($model,'native_language',array('class'=>"error")); ?>
            </div>

            <div class="small-12 column">
		<?php echo $form->labelEx($model,'foreign_language'); ?>
		<?php echo $form->textField($model,'foreign_language',array('size'=>60,'maxlength'=>255),array('class'=>"error")); ?>
		<?php echo $form->error($model,'foreign_language',array('class'=>"error")); ?>
            </div>

            <div class="small-12 column">
		<?php echo $form->labelEx($model,'descripcion'); ?>
		<?php echo $form->textArea($model,'descripcion',array('rows'=>6, 'cols'=>50),array('class'=>"error")); ?>
		<?php echo $form->error($model,'descripcion',array('class'=>"error")); ?>
            </div>

            <div class="small-12 column">
		<?php echo CHtml::submitButton($model->isNewRecord ? 'Create' : 'Save',array('class'=>'button')); ?>
            </div>

<?php $this->endWidget(); ?>

</div><!-- form -->