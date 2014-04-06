<div class="small-12 column">
    
    <div class="small-12 medium-6 column">
        <dl class="accordion" data-accordion>
          <dd>
            <a href="#users">Users online: <span id="total"></span></a>
            <div id="users" class="content active">
                <?php /*$this->widget('zii.widgets.grid.CGridView', array(
                        'dataProvider' => new CArrayDataProvider('Users'),
                        'columns' => array(
                         //specify the colums you wanted here
                        ),
                    ));*/
                
                $rawData=Yii::app()->db->createCommand('SELECT * FROM users')->queryAll();
                echo var_dump($rawData);
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

