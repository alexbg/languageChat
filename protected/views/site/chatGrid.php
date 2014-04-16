<?php
/**
 * Genera la tabla que mostrara la informacion de los usuario
 */
$this->widget('zii.widgets.grid.CGridView', array(
    'id'=>'list-users',
    'dataProvider'=>$dataProvider,
    'afterAjaxUpdate'=>'function(){showProfiles()}',  
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
                    'class'=>'show',
                    'url'=>'Yii::app()->createUrl("users/getInfoUser",array("username"=>$data["username"]))',
                    'options'=>array(
                        'class'=>'show',
                        ),
                    ),

                'private'=>array(
                    'label'=>'start chat',
                    'url'=>''
                    )
                ),
            )
        ),
    'htmlOptions'=>array(
        'class'=>''
    )
 ));
?>


