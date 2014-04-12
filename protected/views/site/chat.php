<div class="small-12 column">
    
    <div class="small-12 medium-6 column">
        <dl class="accordion" data-accordion>
          <dd>
            <a href="#users">Users online: <span id="total"><?php echo $total; ?></span></a>
            <div id="users" class="content active">
               <?php 
                    /*$this->widget('zii.widgets.grid.CGridView', array(
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
                                'url'=>''
                                ),
                            'private'=>array(
                                'label'=>'start chat'
                                )
                            ),
                        )
                    )
                ));*/
                ?>
            </div>
          </dd>
          <dd>
            <a href="#panel2">Accordion 2</a>
            <div id="panel2" class="content">
              Panel 2. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
          </dd>
          <dd>
            <a href="#panel3">Accordion 3</a>
            <div id="panel3" class="content">
              Panel 3. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
          </dd>
        </dl>
    </div>
    <div class="small-12 medium-6 column">
        
    </div>
</div>

