<?php 
$this->widget('zii.widgets.grid.CGridView', array(
'id'=>'list-users',
'dataProvider'=>$dataProvider,
'ajaxUrl'=>Yii::app()->createUrl('site/getGrid'),     
'columns'=>array(
    'username',
    'native_language',
    'foreign_language',

   array(
    'class'=>'CButtonColumn',
    'header'=>'Buttons',
    'template' => '{profile} {private}',   
    'buttons'=>array(

        'profile'=>array(
            'label'=>'show profile',

            ),

        'private'=>array(
            'label'=>'start chat'
            )
        ),
    )
)
));

//$rawData=Yii::app()->db->createCommand('SELECT * FROM users')->queryAll();
//echo var_dump($rawData);


